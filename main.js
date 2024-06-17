class View {
    constructor() {
        this.app = document.getElementById('app');

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchLine.append(this.searchInput);

        this.main = this.createElement('div', 'main')

        this.repositoriesWrapper = this.createElement('div', 'repositories-wrapper');
        this.repositoriesList = this.createElement('ul', 'repositories-list');
        this.repositoriesWrapper.append(this.repositoriesList);
        this.main.append(this.repositoriesWrapper);

        this.mainList = this.createElement('ul', 'main-list');
        this.main.append(this.mainList);

        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createRepositories(repositoryData) {
        const repElement = this.createElement('li', 'repository-item')
        repElement.addEventListener('click', () => {
            this.addListRepositories(repositoryData);
            this.searchInput.value = '';
            this.repositoriesList.innerHTML = '';
        })

        repElement.insertAdjacentHTML('beforeend', `<div class="repository-item__name">${repositoryData.name}</div>`)
        this.repositoriesList.append(repElement);
    }

    addListRepositories(repositoryData) {
        const repository = this.createElement('li', 'main-item');

        repository.insertAdjacentHTML('beforeend', `<div class="main-item__name">Name: ${repositoryData.name}</div>
                                                    <div class="main-item__owner">Owner: ${repositoryData.owner.login}</div>
                                                    <div class="main-item__stars">Stars: ${repositoryData.stargazers_count}</div>`);
        
        
        const btnClose = this.createElement('button', 'btn-close');
        repository.append(btnClose);

        btnClose.addEventListener('click', () => repository.remove())
        this.mainList.append(repository);
    }
}

class Search {
    constructor(view) {
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this), 500))
    }

    async searchRepositories() {
        const searchValue = this.view.searchInput.value.replace(/\s/g, '');
        if (searchValue) {
            this.clearRepositories();
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`).then((res) => {
                if (res.ok) {
                    res.json().then(res => {
                        res.items.forEach(rep => this.view.createRepositories(rep))
                    })
                } else {
    
                }
            } )
        } else {
            this.clearRepositories();
        }
    }

    clearRepositories() {
        this.view.repositoriesList.innerHTML = '';
    }

    debounce(fn, debounceTime) {
        let timer;
    
        return function(...args) {
            clearTimeout(timer);
    
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, debounceTime)
        }
    };
}

new Search(new View());