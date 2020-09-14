import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Diretor } from './../../../core/models/diretor.model';
import { DirectorsService } from './../../../core/services/directors.service';
import { MyToastrService } from './../../../core/services/toastr.service';
import { MoviesService } from './../../../core/services/movies.service';
import * as moment from 'moment';

@Component({
  selector: 'app-new-movie',
  templateUrl: './new-movie.component.html',
  styleUrls: ['./new-movie.component.css']
})
export class NewMovieComponent implements OnInit, OnDestroy {

  private httpRequest: Subscription

  directorFormGroup: FormGroup
  isNewDirector: Boolean = false
  diretores: Diretor[]
  stepDirectorLabel: String = 'Diretor'
  movieFormGroup: FormGroup

  @ViewChild('autosize') autosize: CdkTextareaAutosize

  constructor(
    private directorService: DirectorsService,
    private builder: FormBuilder,
    private toastr: MyToastrService,
    private moviesService: MoviesService,
    private dialogRef: MatDialogRef<NewMovieComponent>
  ) { }

  ngOnInit(): void {
    this.findAllDirectors()
    this.initializeSelectorDirectorFormGroup()
    this.initializeMovieFormGroup()
  }

  ngOnDestroy():void {
    this.httpRequest.unsubscribe()
  }

  findAllDirectors(): void {
    this.httpRequest = this.directorService.findAllDirectors().subscribe(response => {
      this.diretores = response.body['data']
    }, err => {
      console.log(err.error['message'])
    })
  }

  initializeSelectorDirectorFormGroup(): void {
    this.directorFormGroup = this.builder.group({
      diretor: this.builder.control(null, [Validators.required])
    })
  }

  initializeNewDiretorFormGroup(): void {
    this.directorFormGroup = this.builder.group({
      nome: this.builder.control(null, [Validators.required]),
      imagem: this.builder.control(null),
      biografia: this.builder.control(null)
    })
  }

  initializeMovieFormGroup(): void {
    this.movieFormGroup = this.builder.group({
      nome: this.builder.control(null, [Validators.required]),
      genero: this.builder.control(null, [Validators.required]),
      imagem: this.builder.control(null, [Validators.required]),
      sinopse: this.builder.control(null, [Validators.required]),
      classificacaoIndicativa: this.builder.control(null),
      duracao: this.builder.control(null),
      estudio: this.builder.control(null),
      dataLancamento: this.builder.control(null),
      diretor: this.builder.control(null, [Validators.required])
    })
  }

  newDirector(): void {
    this.isNewDirector = !this.isNewDirector
    this.initializeNewDiretorFormGroup()
  }

  selectDirector(): void {
    this.isNewDirector = !this.isNewDirector
    this.findAllDirectors()
    this.initializeSelectorDirectorFormGroup()
  }

  nextStep(): void {
    if (this.isNewDirector) {
      this.createNewDirector(this.directorFormGroup.value)
    } else {
      this.movieFormGroup.controls['diretor'].setValue(this.directorFormGroup.value['diretor']['_id'])
      this.stepDirectorLabel = `Diretor: ${this.directorFormGroup.value['diretor']['nome']}`
    }
  }

  createNewDirector(formValueDirector: Diretor): void {
    this.httpRequest = this.directorService.createNewDirector(formValueDirector).subscribe(response => {
      this.movieFormGroup.controls['diretor'].setValue(response.body['data']['_id'])
      this.stepDirectorLabel = `Diretor: ${response.body['data']['nome']}`
      this.toastr.showToastrSucess(`O diretor ${response.body['data']['nome']} foi adicionado com sucesso`)
    }, err => {
      this.toastr.showToastrError(`${err.error['message']}`)
    })
  }

  createNewMovie(): void {
    this.setDateFormattedOnMovieForm(this.movieFormGroup.value['dataLancamento'])
    console.log(this.movieFormGroup.value['dataLancamento'])
    this.httpRequest = this.moviesService.createNewMovie(this.movieFormGroup.value).subscribe(response => {
      this.toastr.showToastrSucess(`O Filme ${response.body['data']['nome']} foi adicionado com sucesso!!!`)
      this.dialogRef.close(true)
    }, err => {
      this.toastr.showToastrError(`${err.eror['message']}`)
      this.dialogRef.close(false)
    })
  }

  closeDialog(): void {
    this.dialogRef.close(false)
  }

  setDateFormattedOnMovieForm(value: string): void {  
    if (value) {
      let dateFormatted: string = moment.utc(value).local().format('YYYY-MM-DD')
      this.movieFormGroup.controls['dataLancamento'].setValue(dateFormatted)
    }
  }

}
