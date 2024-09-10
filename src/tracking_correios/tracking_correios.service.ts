import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as ExcelJS from 'exceljs';
import { Subject } from 'rxjs';

@Injectable()
export class TrackingCorreiosService {
  private token: string;
  private tokenExpiryTime: number;
  private progressSubject = new Subject<number>();

  get progress$() {
    return this.progressSubject.asObservable();
  }

  constructor(private configService: ConfigService) {}

  async getToken(): Promise<string> {
    try {
      const url = this.configService.get<string>('EMPRESA_RASTREIO_CONSULTA_URL');
      const headers = {
        'Authorization': 'Basic AbcdeFghu',
        'Content-Type': 'application/json',
        'accept': 'application/json',
      };
      const data = {'numero': '0123456'};
      
      const response = await axios.post(url, data, { headers });
      this.token = response.data.token;
      console.log(this.token)
      this.tokenExpiryTime = Date.now() + 60 * 60 * 1000; // 1 hora

      return this.token;
    } catch (error) {
      throw new HttpException('Falha na solicitação do token de acesso', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getValidToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiryTime) {
      return this.token;
    }
    return this.getToken();
  }

  async makeCorreiosRequest(codigoObjeto: string): Promise<any> {
    try {
      const token = await this.getValidToken();
      const tipoDeRetorno = 'U';
      const url = `${this.configService.get<string>('EMPRESA_RASTREIO_CONSULTA_URL')}?codigosObjetos=${codigoObjeto}&resultado=${tipoDeRetorno}`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      };

      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new HttpException('Falha ao executar a requisição', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async importExcelFile(fileBuffer: Buffer): Promise<string[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);

      const worksheet = workbook.getWorksheet(1);
      const codes = [];

      worksheet.eachRow((row, rowNumber) => {
        const codigoObjeto = row.getCell(1).text;
        if (codigoObjeto) {
          codes.push(codigoObjeto);
        }
      });

      return codes;
    } catch (error) {
      throw new HttpException('Erro ao processar o arquivo Excel', HttpStatus.BAD_REQUEST);
    }
  }

  async processBatches(codes: string[], onProgress: (progress: number) => void): Promise<any[]> {
    const batchSize = 100;
    const totalBatches = Math.ceil(codes.length / batchSize);
    const results = [];
  
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, codes.length);
      const batch = codes.slice(start, end);
  
      const batchResults = await Promise.all(batch.map(code => this.makeCorreiosRequest(code)));
      results.push(...batchResults);
  
      const progress = ((i + 1) / totalBatches) * 100;
      onProgress(progress);
    }
  
    return results;
  }
}
