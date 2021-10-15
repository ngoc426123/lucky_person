@Plugin({
  options: {
    dataListPerson: '[data-list-person]',
    dataBtnSpin: '[data-btn-spin]',
  },
  
})
export default class LuckyPerson {
  init () {
    this.props = {
      data: [],
      dataRender: [],
      name: 'ngoc',
      count: 0,
      offsetMax: 0,
    };
    this.initDOM();
    this.handleEvent();
  }

  initDOM () {
    const { $element } = this;
    const {
      dataListPerson,
      dataBtnSpin
    } = this.options;

    this.$listPerson = $element.find(dataListPerson);
    this.$btnSpin = $element.find(dataBtnSpin);
  }

  async handleEvent () {
    const data = await this.fetchData();
    this.initGame(data);

    // ENTER
    $(window).on('keyup', (e) => e.key === 'Enter' && this.handleSpin());
  }

  fetchData () {
    return new Promise ((reslove, reject) => {
      fetch('./data/person.json')
        .then(res => res.json())
        .then(data => reslove(data));
    });
  }

  initGame (data) {
    const DataClone = () => {
      const numberClone = () => data.count < 10 ? 5 : 10;
      const cloneUpData = data.slice(-numberClone()).map(person => { return { ...person, clone: true } });
      const mainData = data.map(person => { return {...person, clone: false} });
      const cloneDownData = data.slice(0, numberClone()).map(person => { return { ...person, clone: true } });
      const dataMerge = [...cloneUpData, ...mainData, ...cloneDownData];
      const dataOffset = dataMerge.map((person, index) => {
        const offset = -(index * 250 + 625)
        return {
          ...person,
          offset,
        }
      });

      return dataOffset;
    }

    this.props.data = data;
    this.props.dataRender = DataClone();
    this.props.count = this.props.data.length;
    this.props.offsetMax = this.props.data.reduce((curr, acc) =>  curr -= 250, -375);
    this.renderPerson();
  }

  handleSpin () {
    console.log(this.randomPerson());
  }

  renderPerson () {
    const { dataRender } = this.props;
    const $person = dataRender.map(person => {
      const {
        name,
        avatar,
        icon,
        count,
        comment,
        clone
      } = person;
      return `<div class="boxLucky__person ${clone ? 'boxLucky__person--clone' : ''}">
        <div class="boxLucky__person--image" style="background-image: url(${avatar})"></div>
        <div class="boxLucky__person--info">
          <div class="boxLucky__person--name">${name}</div>
          <div class="boxLucky__person--attr">
            <div class="boxLucky__person--itemAtrr fa-chess-queen">${icon}</div>
            <div class="boxLucky__person--itemAtrr fa-eye">${count}</div>
            <div class="boxLucky__person--itemAtrr fa-comments">${comment}</div>
          </div>
        </div>
      </div>`;
    });

    this.$listPerson.append($person);
  }

  randomPerson () {
    const { data } = this.props;
    const randomIndex = Math.floor(Math.random() * data.length - 1) + 0;
    const randomPerson = data[randomIndex];

    this.props.data = data.splice(randomIndex, 1);
    console.log(data.splice(randomIndex, 1));
    return randomPerson;
  }
}