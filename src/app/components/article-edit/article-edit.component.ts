import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../../models/article';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../../reducers';
import * as aa from '../../actions/articles.actions';

@Component({
    selector: 'btr-article-edit',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './article-edit.component.html',
    styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnDestroy {
    private articleSubscription: Subscription;
    private articleId: string;

    public editArticleForm: FormGroup;
    public submitted: boolean = false;

    public constructor(private store: Store<fromRoot.State>,
                       private route: ActivatedRoute,
                       private sanitizer: DomSanitizer,
                       private fb: FormBuilder) {
        this.articleId = this.route.snapshot.params['Id'];
        this.articleSubscription = this.store.select(fromRoot.getArticle(this.articleId))
            .take(1)
            .map(article => {
               this.editArticleForm = fb.group({
                   Title: [article.Title, Validators.compose(
                       [Validators.required, Validators.maxLength(100)])],
                   Content: [article.Content, Validators.required],
                   CoverImageUrl: [article.CoverImageUrl, Validators.required]
               });
            }).subscribe();
    }

    ngOnDestroy() {
        if (this.articleSubscription)
            this.articleSubscription.unsubscribe();
    }

    public safeContent(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            this.editArticleForm.value.Content);
    }

    public editArticle(): void {
        this.submitted = true;
        const article: Article = {
            Id: +this.articleId,
            Title: this.editArticleForm.value.Title,
            Content: this.editArticleForm.value.Content,
            CoverImageUrl: this.editArticleForm.value.CoverImageUrl,
            Author: '',
            Date: ''
        };
        this.store.dispatch(new aa.UpdateAction(article));
    }
}
