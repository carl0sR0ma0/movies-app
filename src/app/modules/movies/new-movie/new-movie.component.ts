import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Subscription } from 'rxjs';
import { Diretor } from './../../../core/models/diretor.model';
import { DirectorsService } from './../../../core/services/directors.service';
import { MyToastrService } from './../../../core/services/toastr.service';

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

  @ViewChild('autosize') autosize: CdkTextareaAutosize

  constructor(
    private directorService: DirectorsService,
    private builder: FormBuilder,
    private toastr: MyToastrService
  ) { }

  ngOnInit(): void {
    this.findAllDirectors()
    this.initializeSelectorDirectorFormGroup()
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
      this.stepDirectorLabel = `Diretor: ${this.directorFormGroup.value['diretor']['nome']}`
    }
  }

  createNewDirector(formValueDirector: Diretor): void {
    this.httpRequest = this.directorService.createNewDirector(formValueDirector).subscribe(response => {
      //definir o ID no formulário de filme
      this.stepDirectorLabel = `Diretor: ${response.body['data']['nome']}`
      this.toastr.showToastrSucess(`O diretor ${response.body['data']['nome']} foi adicionado com sucesso`)
    }, err => {
      this.toastr.showToastrError(`${err.error['message']}`)
    })
  }

}