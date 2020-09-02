import { Diretor } from './diretor.model';

export interface Filme {
  _id: String
  nome: String
  genero: String
  classificao?: String
  dataLancamento?: Number
  estudio?: String
  duracao?: Number
  imagem: String
  sinopse: String
  diretor: Diretor
}