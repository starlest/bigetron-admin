import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Article } from '../../models';
import * as fromRoot from '../../reducers';



@Component({
    selector: 'btr-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
    private articleSubscription: Subscription;
    private articleId: string;

    // Initialise initial values to prevent template errors
    public article: Article = {
        Id: -1,
        Title: '',
        Author: '',
        Date: '',
        Content: '',
        CoverImageUrl: ''
    };

    public constructor(private store: Store<fromRoot.State>,
                       private route: ActivatedRoute,
                       private sanitizer: DomSanitizer) {
        this.articleId = this.route.snapshot.params['Id'];
        this.articleSubscription =
            this.store.select(fromRoot.getArticle(this.articleId))
                .take(1)
                .map(
                    article => Object.assign(this.article, article))
                .subscribe();
    }

    public ngOnDestroy() {
        if (this.articleSubscription)
            this.articleSubscription.unsubscribe();
    }

    public safeContent(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.article.Content);
    }

    // TODO: implement
    public editArticle(): void {

    }
}
