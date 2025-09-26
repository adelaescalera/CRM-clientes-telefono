export interface IRespGeneric {
    code: number;
    message: string;
    data: any;
}

export interface AddClient {
  nombre: string;
  dni: string;
  direccion?: string;
  telefonos?: [];
}
