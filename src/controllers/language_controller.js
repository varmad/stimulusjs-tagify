import { Controller } from "stimulus"
import Tagify from '@yaireo/tagify'

export default class extends Controller {
  connect() {
    this.languages();
  }

  languages() {
    var that = this;
    const url = '/languages.json';
    const titleInput = document.querySelector('input[name=language]');
    const language = new Tagify(titleInput, {
      whitelist: [],
      maxTags: 10,
      dropdown: {
        maxItems: 20, // <- mixumum allowed rendered suggestions
        classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
        enabled: 0, // <- show suggestions on focus
        closeOnSelect: false, // <- do not hide the suggestions dropdown once an item has been selected
      },
    });

    language.on('focus', function (e) {
      that.loadWhiteList(e, language, url);
    });
  }


  loadWhiteList(e, language, url) {
    let controller;
    const value = e.detail.value;
    language.settings.whitelist.length = 0; // reset the whitelist

    controller && controller.abort();
    controller = new AbortController();

    language.loading(true).dropdown.hide.call(language);

    fetch(`${url}?value=${value}`, { signal: controller.signal })
      .then((RES) => RES.json())
      .then(function (whitelist) {
        language.settings.whitelist.splice(
          0,
          whitelist.length,
          ...whitelist
        );
        language.loading(false).dropdown.show.call(language, value);
      });
  }
}
