import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MoviesService } from './../../../core/services/movies.service';
import { Filme } from './../../../core/models/filme.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMovieComponent } from '../update-movie/update-movie.component';

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
    private dialog: MatDialog
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

}
