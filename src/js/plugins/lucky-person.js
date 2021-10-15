@Plugin({
  options: {
    personHeight: 200,
    numberAnonymous: 3,
    dataBoxlucky: '[data-box-lucky]',
    dataListPerson: '[data-list-person]',
    dataBtnSpin: '[data-btn-spin]',
    clsSpining: 'spinning',
    clsBingo: 'bingo',
    clsNotClick: 'not-click',
  },
  
})
export default class LuckyPerson {
  init () {
    this.props = {
      data: [],
      dataRender: [],
      name: 'ngoc',
      count: 0,
      offsetMin: 0,
      offsetMax: 0,
      offsetClone: 0,
      spin: null,
      isSpin: false,
      isPreventFastSpin: false,
    };
    this.initDOM();
    this.handleEvent();
  }

  initDOM () {
    const { $element } = this;
    const {
      dataBoxlucky,
      dataListPerson,
      dataBtnSpin
    } = this.options;

    this.$boxLucky = $element.find(dataBoxlucky);
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
    const { personHeight, numberAnonymous } = this.options;
    const DataClone = () => {
      const numberClone = () => data.count < 10 ? 5 : 10;
      const cloneUpData = data.slice(-numberClone()).map(person => { return { ...person, clone: true } });
      const mainData = data.map(person => { return {...person, clone: false} });
      const cloneDownData = data.slice(0, numberClone()).map(person => { return { ...person, clone: true } });
      const dataMerge = [...cloneUpData, ...mainData, ...cloneDownData];
      const dataOffset = dataMerge.map((person, index) => {
        const offset = - (index * personHeight + (personHeight * numberAnonymous - (personHeight / 2)));

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
    this.props.offsetMin = this.props.dataRender[1].offset;
    this.props.offsetMax = this.props.dataRender[this.props.dataRender.length - 2].offset;
    this.props.offsetClone = (data.count < 10 ? 5 : 10) * personHeight;
    this.props.spin = gsap.timeline({ defaults: {duration: 0, ease: 'none'}});
    this.renderPerson();
  }

  async handleSpin () {
    const { spin, isSpin, isPreventFastSpin } = this.props;
    const { clsSpining, clsBingo } = this.options;

    if ( isPreventFastSpin ) {
      return;
    }

    if ( !isSpin ) {
      this.props.isSpin = true;
      this.props.isPreventFastSpin = true;
      this.toggleSpin();
      this.$listPerson.addClass(clsSpining);
      spin.play();
      spin.fromTo(this.$listPerson, { y: this.props.offsetMin }, { y: this.props.offsetMax, repeat: -1, duration: 0.5, ease: 'none' });
      await new Promise((reslove, reject) => {setTimeout(reslove, 1500)});
      this.props.isPreventFastSpin = false;
      this.toggleSpin();
    } else {
      const randomPerson = this.randomPerson();
      const positionPerson = this.getPositionPerson(randomPerson);
      const positionEdge = positionPerson - this.props.offsetClone;

      this.props.isSpin = false;
      this.props.isPreventFastSpin = true;
      this.toggleSpin();
      this.$listPerson.removeClass(clsSpining);
      spin.pause();
      gsap.fromTo(this.$listPerson, { y: positionEdge }, { y: positionPerson, duration: 4, ease: 'circ.out', onComplete: () => {
        this.$boxLucky.addClass(clsBingo);
        this.$boxLucky.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', () => {
          this.$boxLucky.removeClass(clsBingo);
          this.props.isPreventFastSpin = false;
          this.toggleSpin();
        })
      }});
    }
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
    const randomIndex = parseInt(Math.floor(Math.random() * (data.length - 1)) + 0);
    const randomPerson = data[randomIndex];

    this.props.data.splice(randomIndex, 1);
    return randomPerson;
  }

  getPositionPerson (personRandom) {
    const { dataRender } = this.props;
    const { name } = personRandom;
    const person = dataRender.filter(person => person.clone === false && person.name === name);
    const offset = person[0].offset;

    return offset;
  }

  toggleSpin () {
    const { clsNotClick, clsSpining } = this.options;
    const { isSpin, isPreventFastSpin } = this.props;

    isPreventFastSpin && this.$btnSpin.addClass(clsNotClick);
    !isPreventFastSpin && this.$btnSpin.removeClass(clsNotClick);

    isSpin && this.$btnSpin.addClass(clsSpining);
    !isSpin && this.$btnSpin.removeClass(clsSpining);
  }
}