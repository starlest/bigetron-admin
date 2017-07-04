import { Component } from '@angular/core';

@Component({
	selector: "btr-not-found-page",
	template: `
      <h1 class="error">
        ERROR 404: Ooops... There is nothing here! <i class="fa fa-frown-o"
                                           aria-hidden="true"></i>
      </h1>
`,
	styles: [
		`
      .error {
          text-align: center;
          margin: 50px auto;
      }
`
	]
})
export class NotFoundPageComponent {
}
