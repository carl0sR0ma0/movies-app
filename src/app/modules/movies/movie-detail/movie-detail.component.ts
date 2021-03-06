import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MoviesService } from './../../../core/services/movies.service';
import { Filme } from './../../../core/models/filme.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMovieComponent } from '../update-movie/update-movie.component';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { MyToastrService } from 'src/app/core/services/toastr.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {

  private httpRequest: Subscription
  Filme: Filme
  hasError: boolean = false
  movieName: String

  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesService: MoviesService,
    private dialog: MatDialog,
    private toastr: MyToastrService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.movieName = this.activatedRoute.snapshot.params['movieName'];
    this.findMovieByName(this.movieName)
  }

  ngOnDestroy(): void {
    this.httpRequest.unsubscribe()
  }

  findMovieByName(movieName: String): void {
    this.httpRequest = this.moviesService.findMovieByName(movieName).subscribe(response => {
      this.Filme = response.body['data']
    }, err => {
      this.hasError = true
    })
  }

  openUpdateMovieModal(): void {
    const dialogRef = this.dialog.open(UpdateMovieComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: this.Filme
    })

    dialogRef.afterClosed().subscribe(updatedMovie => {
      if (updatedMovie) {
        this.Filme = undefined
        this.findMovieByName(this.movieName)
      }
    })
  }

  openConfirmModal(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      width: '600px',
      height: '160px',
      data: `Deseja apagar ${this.Filme['nome']}? A ação é irreversível!`
    })

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteMovie(this.Filme['_id'])
      }
    })
  }

  deleteMovie(movieId: String): void {
    this.httpRequest = this.moviesService.deleteMovieById(movieId).subscribe(response => {
      this.toastr.showToastrSucess(`O filme ${this.Filme['nome']} foi apagado com sucesso`)
      this.route.navigate(['/movies'])
    }, err => {
      this.toastr.showToastrError(`${err.status} - ${err.error['message']}`)
    })
  }

}
