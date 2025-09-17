/*
Para devolver la respuesta en el controller usamos Generic Response: que es un formato estándar para devolver datos desde los controllers al frontend. La estructura puede ser la siguiente: 
 
export interface IGenericResponse {
  message?: string;
  data?: any;
  code?: number
}
*/