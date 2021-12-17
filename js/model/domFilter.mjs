export default class DomFilter {
    constructor(elFilter) {
        this.name = elFilter.dataset.filter;
        this.container = elFilter;
        this.label = elFilter.querySelector('[data-filter-label]');
        this.input = elFilter.querySelector('[data-filter-input]');
        this.results = elFilter.querySelector('[data-filter-results]');
        this.expand = elFilter.querySelector('[data-filter-expand]');
    }
};