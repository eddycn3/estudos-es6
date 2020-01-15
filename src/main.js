import api from "./api";

class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.getElementById("form-id");
    this.repoListEl = document.getElementById("repo-list");
    this.inputEl = document.querySelector("input[name=repository]");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement("span");
      loadingEl.appendChild(document.createTextNode("Carregando"));
      loadingEl.setAttribute("id", "loading");

      this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById("loading").remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    console.log(repoInput);
    if (repoInput === "") return;

    this.setLoading();

    try {
      const response = await api.get(`/repos/${repoInput}`);

      console.log(response);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = "";

      this.render();
    } catch (error) {
      alert("O repositório não existe");
    }
    this.setLoading(false);
  }

  render() {
    this.repoListEl.innerHTML = "";
    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let titleEl = document.createElement("strong");
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let divEl = document.createElement("div");

      let listItemEl = document.createElement("li");

      divEl.appendChild(imgEl);
      divEl.appendChild(titleEl);
      divEl.appendChild(descriptionEl);
      divEl.appendChild(linkEl);

      listItemEl.appendChild(divEl);

      this.repoListEl.appendChild(listItemEl);
    });
  }
}

new App();
