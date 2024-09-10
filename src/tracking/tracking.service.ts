import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrackingService {
  private token: string;
  private tokenExpiryTime: number;

  // clienteId(Id da Bcard) e cttId(Contratos ativos) como valores fixos. Foram definidos pela Flash Courier
  private readonly clienteId: number = 6253;
  private readonly cttId: number[] = [8239, 8596, 8597, 8598, 8599, 8950, 9553];

  constructor(private configService: ConfigService) {}

  async getToken(): Promise<string> {
    try {
      const url = this.configService.get<string>('EMPRESA_RASTREIO_TOKEN_URL');
      const headers = {
        'Authorization': this.configService.get<string>('EMPRESA_RASTREIO_AUTH_HEADER'),
        'Content-Type': 'application/json',
      };
      const data = {
        login: this.configService.get<string>('EMPRESA_RASTREIO_LOGIN'),
        senha: this.configService.get<string>('EMPRESA_RASTREIO_SENHA'),
      };

      const response = await axios.post(url, data, { headers });
      this.token = response.data.access_token;
      this.tokenExpiryTime = Date.now() + 43200000; // 12 horas
      // 12 * 60 * 60 * 1000

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

  async makeRequest(numEncCli: string[]): Promise<any> {
    try {
      const token = await this.getValidToken();
      const url = this.configService.get<string>('EMPRESA_RASTREIO_CONSULTA_URL');
      const headers = {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
        'Cookie': 'ROUTEID=.web2; ROUTEID=.web2; ROUTEID=.web4',
      };

      const data = {
        clienteId: this.clienteId,
        cttId: this.cttId,
        numEncCli: numEncCli,
      };

      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new HttpException('Falha ao executar a requisição', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async importClients(clientsData: any[]): Promise<any> {
    try {
      const token = await this.getValidToken();
      const url = this.configService.get<string>('EMPRESA_RASTREIO_IMPORTACAO_URL');
      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
        'Cookie': 'ROUTEID=.1',
      };

      const response = await axios.post(url, clientsData, { headers });
      return response.data;
    } catch (error) {
      throw new HttpException('Falha ao importar clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

