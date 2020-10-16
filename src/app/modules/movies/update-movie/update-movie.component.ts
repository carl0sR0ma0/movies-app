import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Diretor } from 'src/app/core/models/diretor.model';
import { Filme } from 'src/app/core/models/filme.model';
import { DirectorsService } from 'src/app/core/services/directors.service';
import { MoviesService } from 'src/app/core/services/movies.service';
import { MyToastrService } from 'src/app/core/services/toastr.service';
import * as moment from 'moment'

@Component({
  selector: 'app-update-movie',
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.css']
})
export class UpdateMovieComponent implements OnInit, OnDestroy {

  private httpRequest: Subscription

  Movie: Filme
  movieFormGroup: FormGroup
  directors: Diretor[]

  @ViewChild('autosize') autosize: CdkTextareaAutosize

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Filme,
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateMovieComponent>,
    private directorsService: DirectorsService,
    private moviesService: MoviesService,
    private toastr: MyToastrService
  ) { 
    this.Movie = data
  }

  ngOnInit(): void {
    this.findAllDirectors()
    this.initializeMovieFormGroup()
    this.populateFormGroup()
  }

  ngOnDestroy(): void {
    this.httpRequest.unsubscribe()
  }

  findAllDirectors(): void {
    this.httpRequest = this.directorsService.findAllDirectors().subscribe(response => {
      this.directors = response.body['data']
    }, err => {
      this.toastr.showToastrError(`${err.status} - ${err.error['message']}`)
    })
  }

  initializeMovieFormGroup(): void {
    this.movieFormGroup = this.builder.group({
      genero: this.builder.control(null, [Validators.required]),
      imagem: this.builder.control(null, [Validators.required]),
      sinopse: this.builder.control(null, [Validators.required]),
      diretor: this.builder.control(null, [Validators.required]),
      classificacaoIndicativa: this.builder.control(null),
      dataLancamento: this.builder.control(null),
      duracao: this.builder.control(null)
    })
  }

  populateFormGroup(): void {
    this.movieFormGroup.patchValue({
      genero: this.Movie['genero'],
      imagem: this.Movie['imagem'],
      sinopse: this.Movie['sinopse'],
      diretor: this.Movie['diretor'],
      classificacaoIndicativa: this.Movie['classificacaoIndicativa'],
      dataLancamento: this.Movie['dataLancamento'],
      duracao: this.Movie['duracao']
    })
  }

  compareDirector(d1: Diretor, d2: Diretor): boolean {
    return d1 && d2 ? d1._id == d2._id : d1 === d2
  }

  closeDialog(b: boolean = false): void {
    this.dialogRef.close(b)
  }

  updateMovie(): void {
    this.setDateFormattedOnMovieForm(this.movieFormGroup.value['dataLancamento'])
    this.httpRequest = this.moviesService.updateMovieById(this.Movie['_id'], this.movieFormGroup.value).subscribe(response => {
      this.toastr.showToastrSucess(`O filme ${this.Movie['nome']} foi atualizado com sucesso`)
      this.dialogRef.close(true)
    }, err => {
      this.toastr.showToastrError(`${err.status} - ${err.error['message']}`)
      this.dialogRef.close()
    })
  }

  setDateFormattedOnMovieForm(value: string): void {
    if (value) {
      let dateFormatted: string = moment.utc(value).local().format('YYYY-MM-DD')
      this.movieFormGroup.controls['dataLancamento'].setValue(dateFormatted)
    }
  }

}
