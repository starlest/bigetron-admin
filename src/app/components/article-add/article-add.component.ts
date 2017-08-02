import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../../models/article';
import * as fromRoot from '../../reducers';
import * as aa from '../../actions/articles.actions';

@Component({
    selector: 'btr-article-add',
    templateUrl: './article-add.component.html',
    styleUrls: ['./article-add.component.scss']
})
export class ArticleAddComponent {
    public addArticleForm: FormGroup;
    public submitted: boolean = false;

    public constructor(private store: Store<fromRoot.State>,
                       private sanitizer: DomSanitizer,
                       private fb: FormBuilder) {
        this.addArticleForm = this.fb.group({
            Title: ['', Validators.compose(
                [Validators.required, Validators.maxLength(100)])],
            Content: ['', Validators.required],
            CoverImageUrl: ['', Validators.required]
        });
    }

    public safeContent(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            this.addArticleForm.value.Content);
    }

    public addArticle(): void {
        this.submitted = true;
        const article: Article = {
            Id: 0,
            Title: this.addArticleForm.value.Title,
            Content: this.addArticleForm.value.Content,
            CoverImageUrl: this.addArticleForm.value.CoverImageUrl,
            Author: '',
            Date: ''
        };
        this.store.dispatch(new aa.AddAction(article));
    }
}
