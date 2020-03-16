import {
  Signal
} from "signals"
import Card from "../component/Card";

export default class SolitaireController {
  gameType = null;

  onChange = new Signal();
  onChangePoints = new Signal();
  finishGame = new Signal();

  appliedEvents = [];
  stock = [];
  waste = [];
  clickedCard = []
  wasteEmpty = true

  foundations = {
    f1: []
  };

  tableau = {
    t1: [],
    t2: [],
    t3: [],
    t4: [],
    t5: [],
    t6: [],
    t7: [],
    t8: [],
    t9: [],
    t10: [],
    t11: [],
    t12: [],
    t13: [],
    t14: [],
    t15: [],
    t16: [],
    t17: [],
    t18: [],
    t19: [],
    t20: [],
    t21: [],
    t22: [],
    t23: [],
    t24: [],
    t25: [],
    t26: [],
    t27: [],
    t28: []
  };

  constructor(type) {
    // this.gameType = type;
    window.controller = this
  }

  // fakePrepare(deck) {
  //   for (let card of deck) {
  //     this.stock.push({
  //       id: card.id,
  //       number: card.number,
  //       color: card.color,
  //       flipped: card.flipped
  //     });
  //   }
  //   this._shuffleDeck();
  //   let events = [];
  //   let flipEvents = [];
  //   while (this.stock.length) {
  //     for (let j = 1; j <= 4; j++) {
  //       let card = this.stock.pop();
  //       this.foundations[`f${j}`].push(card);
  //       flipEvents.push({
  //         card,
  //         flip: {
  //           flipped: false,
  //           prev: card.flipped
  //         }
  //       });
  //       card.flipped = false;
  //       events.push({
  //         card,
  //         move: {
  //           field: "foundations",
  //           number: j,
  //           order: 0,
  //           from: {}
  //         }
  //       });
  //     }
  //   }

  //   this._applyEvents(events, true);
  //   setTimeout(() => {
  //     this._applyEvents(flipEvents, true);
  //   }, 300);
  // }
  prepare(deck) {
    let events = [];
    let flipEvents = [];

    for (let card of deck) {
      this.stock.push({
        id: card.id,
        number: card.number,
        color: card.color,
        flipped: card.flipped
      });

    }
    this._shuffleDeck();

    for (let i = 1; i <= 28; i++) {
      let card = this.stock.pop();
      this.tableau[`t${i }`].push(card);
      flipEvents.push({
        card,
        flip: {
          flipped: false,
          prev: card.flipped
        }
      });

      card.flipped = false;
      events.push({
        card,
        move: {
          field: "tableau",
          number: i,
          order: 1,
          from: {}
        }
      });
    }

    for (let i = 0; i < this.stock.length; i++) {
      let card = this.stock[i]
      flipEvents.push({
        card,
        flip: {
          flipped: false,
          prev: card.flipped
        }
      });
      card.flipped = false;
    }


    this._applyEvents(events, true);
    setTimeout(() => {
      this._applyEvents(flipEvents, true);
    }, 300);
  }

  checkPossibleMove(cardId, activeTableau) {
    if (cardId) {
      this._checkPossibleMove(cardId, activeTableau)
    }
  }

  _isCardFree(fieldNum, activeTableau) {
    let activeCard = false
    for (let i = 0; i < activeTableau.length; i++) {
      if (fieldNum === activeTableau[i].no) activeCard = true;
    }
    if (!activeCard) return false;

    return true;
  }

  _checkPossibleMove(cardId = null, activeTableau = false) {
    if (cardId) {
      let cardInfo = this._getCardInfo(cardId)

      if (!cardInfo) return false

      if (cardInfo.card.flipped) return false

      if (cardInfo.fieldName != 'waste' && cardInfo.fieldName != 'tableau' && cardInfo.fieldName != 'stock') return false

      if (activeTableau) {
        let freeCard = this._isCardFree(cardInfo.fieldNumber, activeTableau)

        if (cardInfo.card.flipped || cardInfo.cardOrder < cardInfo.field.length - 1 || !freeCard) return

        if (cardInfo.card.number === 13) {
          let to = {
            fieldName: "foundations",
            fieldNumber: 1,
            order: 0,
          }
          let from = {
            fieldName: cardInfo.fieldName,
            fieldNumber: cardInfo.fieldNumber,
            cardOrder: cardInfo.cardOrder,
            field: cardInfo.field
          }
          this._dispatchMoveEvents(cardInfo.card, to, from)
          return true
        }
      } else {

        if (cardInfo.card.number === 13) {
          let to = {
            fieldName: "foundations",
            fieldNumber: 1,
            order: 0,
          }
          let from = {
            fieldName: cardInfo.fieldName,
            fieldNumber: cardInfo.fieldNumber,
            cardOrder: cardInfo.cardOrder,
            field: cardInfo.field
          }
          this._dispatchMoveEvents(cardInfo.card, to, from)
          return true
        }
      }
      return false
    }
    return false
  }

  _dispatchMoveEvents(card, to, from) {
    let events = []
    let movingCard
    if (from.fieldName == 'tableau')
      movingCard = this[`${from.fieldName}`][`t${from.fieldNumber}`].pop()
    else movingCard = this[`${from.fieldName}`].pop()

    this[`${to.fieldName}`][`f${to.fieldNumber}`].push(movingCard)

    events.push({
      card,
      move: {
        field: to.fieldName,
        number: to.fieldNumber,
        order: 0,
        from: {
          field: from.fieldName,
          number: from.fieldNumber,
          order: from.cardOrder
        }
      }
    })
    if (from.field[from.field.length - 1]) {
      events.push({
        card: from.field[from.field.length - 1],
        flip: {
          flipped: false,
          prev: from.field[from.field.length - 1].flipped
        }
      });
      this.onChangePoints.dispatch(5)
      from.field[from.field.length - 1].flipped = false;
    }
    events.push({
      card: card,
      flip: {
        flipped: true,
        prev: false
      }
    })
    card.flipped = true;
    this._applyEvents(events);
    return
  }

  undo() {
    if (!this.appliedEvents.length) return;

    this.onChangePoints.dispatch(-5)
    let undoEvents = this.appliedEvents.pop();
    let moveEvents = [];
    let flipEvents = [];
    let events = [];

    let moveTypes = []
    for (let event of undoEvents.reverse()) {
      if (event.move) {
        moveTypes.push(`${event.move.field}-${event.move.number}`)
        moveEvents.push(event);
      } else if (event.flip) {
        flipEvents.push(event);
      }
    }

    if (moveEvents.length > 1 && moveEvents.length < 14) {
      let groupedMoves = {}
      for (let event of moveEvents) {
        if (!groupedMoves[`${event.move.field}-${event.move.number}`]) {
          groupedMoves[`${event.move.field}-${event.move.number}`] = []
        }
        groupedMoves[`${event.move.field}-${event.move.number}`].push(event)
      }
      if (groupedMoves['stock-1']) {
        groupedMoves['stock-1'] = groupedMoves['stock-1'].reverse()
      }
      for (let group in groupedMoves) {
        groupedMoves[group].forEach(event => events.push(this._undoExactMove(event)))
      }
    } else {
      for (let event of moveEvents) {
        events.push(this._undoMove(event));
      }
    }
    
    for (let event of flipEvents) {
      events.push(this._undoFlip(event));
    }

    this.onChange.dispatch(events);
  }

  _undoMove(event) {
    let {
      card,
      move: {
        from
      }
    } = event;
    let currentList = this._getField(event.move.field, event.move.number);
    let undoList = this._getField(
      event.move.from.field,
      event.move.from.number
    );
    let undoCard = currentList.pop();
    undoList.push(undoCard);
    return {
      card,
      move: from
    };
  }

  _undoExactMove(event) {
    let {
      card,
      move: {
        from
      }
    } = event;
    let currentList = this._getField(event.move.field, event.move.number);
    let undoList = this._getField(
      event.move.from.field,
      event.move.from.number
    );

    let moveIndex = null
    for (let [index, c] of currentList.entries()) {
      if (card.id === c.id) {
        moveIndex = index
      }
    }
    let tempCard = currentList.splice(moveIndex, 1)
    undoList.push(...tempCard)

    return {
      card,
      move: from
    }
  }

  _undoFlip(event) {
    let {
      card,
      flip: {
        prev
      }
    } = event;
    
    card.flipped = prev;
    return {
      card,
      flip: {
        flipped: prev
      }
    };
  }

  _getField(fieldName, fieldNumber) {
    let field = this[fieldName];
    if (fieldName === "tableau" || fieldName === "foundations") {
      field = field[fieldName.charAt(0) + fieldNumber];
    }
    return field;
  }

  canDrag(id, activeTableau) {

    let dragedCardInfo = this._getCardInfo(id)
    if (dragedCardInfo.card.flipped) return false;

    if (dragedCardInfo.fieldName == 'stock') {
      if (dragedCardInfo.cardOrder == this.stock.length - 1) {
        return true;
      }
    }

    for (let [index, card] of this.waste.entries()) {
      if (card.id === id && index !== this.waste.length - 1) {
        return false;
      }
    }

    for (let key in this.tableau) {
      let tableauList = this.tableau[key];
      for (let card of tableauList) {
        if (card.id === id) {
          let cardInfo = this._getCardInfo(id)

          let freeCard = this._isCardFree(cardInfo["fieldNumber"], activeTableau)

          if (!freeCard) return false;

          if (card.flipped) {
            return false;
          }
        }
      }
    }
    return true;
  }

  canPlace(id, field, number) {
    let holderKey = field.charAt(0) + number;
    let cardList;
    if (field == 'waste' || field == 'stock') cardList = this[field];
    else cardList = this[field][holderKey];

    if (field === "foundations")
      return this._canPlaceFoundations(this._getCardInfo(id), cardList, number);
    if (field === "tableau")
      return this._canPlaceTableau(this._getCardInfo(id), cardList, number);
    if (field === "stock" || field === 'waste')
      return this._canPlaceWaste(this._getCardInfo(id), cardList, number)
    return false;
  }

  emptyDeck() {
    if (!this.waste.length || this.stock.length) return false
    console.log(this.wasteEmpty, this.stock);

    let events = [];
    let order = 0;	

      while (this.waste.length !== 0) {	        
        let card = this.waste.pop();	        
        this.stock.push(card);	        
        events.push({	        
          card,	
          move: {	
            field: "stock",	
            number: 1,	
            order,	
            from: {	
              field: "waste",	
              number: 1,	
              order: this.waste.length	
            }	
          }	
        });	
        order++;	
      }
      this._applyEvents(events)
  }

  canClick(cardId) {
    let info = this._getCardInfo(cardId);
    if (info["fieldName"] !== "tableau" && info["fieldName"] !== "waste") return false;

    if (info["fieldNumber"] >= 22 && info["fieldNumber"] <= 28) {
      if (!this.clickedCard.length)
        this.clickedCard.push(info['card'])
      else {
        if (this.clickedCard[0].number + info.card.number == 13) {}
        this.clickedCard = [];
      }
      return true;
    }
  }

  canOpen(cardId) {
    let info = this._getCardInfo(cardId);

    if (!info) return true;
    if (info["fieldName"] !== "stock") return false;
    // if (this.gameType === 3) return this._openThree(info);
    let card = this.stock.pop();
    this.waste.push(card);
    let events = [];
    events.push({
      card,
      move: {
        field: "waste",
        number: 1,
        order: this.waste.length,
        from: {
          field: "stock",
          number: info.fieldNumber,
          order: info.cardOrder
        }
      }
    });
    events.push({
      card,
      flip: {
        flipped: false,
        prev: card.flipped
      }
    });
    card.flipped = false;
    this._applyEvents(events);

    return true;
  }

  getTableauArray(id) {
    let list = [];
    for (let key in this.tableau) {
      let collectable = false;
      for (let [index, card] of this.tableau[key].entries()) {
        if (id === card.id) {
          collectable = true;
        }
        if (collectable) {
          list.push(card);
        }
      }
    }
    return list;
  }

  _canPlaceFoundations(cardInfo, cardList, fieldNumber) {
    let {
      card,
      field,
      fieldName
    } = cardInfo;

    let placed = false;

    if (card.number == 13) {
      let temp = field.pop();
      cardList.push(temp);
      placed = true;
    } else placed = false;

    if (placed) {
      let events = [];
      let flipEvents = []
      events.push({
        card,
        move: {
          field: "foundations",
          number: fieldNumber,
          order: 0,
          from: {
            field: fieldName,
            number: cardInfo.fieldNumber,
            order: cardInfo.cardOrder
          }
        }
      });
      if (field[field.length - 1]) {
        events.push({
          card: field[field.length - 1],
          flip: {
            flipped: false,
            prev: field[field.length - 1].flipped
          }
        });
        this.onChangePoints.dispatch(5)
        field[field.length - 1].flipped = false;
      }

      if(this.foundations[this.foundations.length-1]){
        console.log('sasd');
        
        flipEvents.push({
          card: this.foundations[this.foundations.length-1],
          flip:{
            flipped: true,
            prev: false
          }
        })
        this.foundations[this.foundations.length-1].flipped = true
        this._applyEvents(flipEvents);
      }

      
      this._applyEvents(events);
      // this._checkFinish();
      if (fieldName != 'foundations')
        this.onChangePoints.dispatch(10)
    }

    return placed;
  }

  _canPlaceTableau(cardInfo, cardList, fieldNumber) {
    let {
      card,
      field,
      fieldKey,
      fieldName
    } = cardInfo;
    // WASTE

    if (fieldName === "waste" || fieldName === "foundations" || fieldName === "tableau" || fieldName === "stock") {
      let lastCard = cardList[cardList.length - 1] || null;

      let lastCardInfo
      if (lastCard) {
        lastCardInfo = this._getCardInfo(lastCard.id)

        if (card.number + lastCard.number !== 13) return false;
      } else return false;


      let events = []
      let temp, temp2;
      temp = field.pop();
      this.foundations.f1.push(temp)
      temp2 = lastCardInfo.field.pop()
      this.foundations.f1.push(temp2)

      events.push({
        card,
        move: {
          field: "foundations",
          number: 1,
          order: 0,
          from: {
            field: fieldName,
            number: cardInfo.fieldNumber,
            order: cardInfo.cardOrder
          }
        }
      }, {
        card: lastCardInfo.card,
        move: {
          field: "foundations",
          number: 1,
          order: 0,
          from: {
            field: "tableau",
            number: lastCardInfo.fieldNumber,
            order: lastCardInfo.cardOrder
          }
        }
      }, {
        card: card,
        flip:{
          flipped: true,
          prev: false
        }
      },{
        card: lastCardInfo.card,
        flip:{
          flipped: true,
          prev: false
        }})
        card.flipped = true;
        lastCardInfo.card.flipped = true;
      this._applyEvents(events);
      return true;
    }
    return false;
  }

  _canPlaceWaste(cardInfo, cardList, fieldNumber) {
    if (!cardList[cardList.length - 1] || cardInfo.card.flipped) return false;

    if (cardList[cardList.length - 1].number + cardInfo.card.number == 13) {

      let events = []
      let lastCardInfo = this._getCardInfo(cardList[cardList.length - 1].id)
      if (lastCardInfo.card.flipped) return false;
      let temp, temp2
      temp = cardInfo.field.pop();
      this.foundations.f1.push(temp)
      temp2 = lastCardInfo.field.pop()
      this.foundations.f1.push(temp2)

      events.push({
        card: cardInfo.card,
        move: {
          field: "foundations",
          number: 1,
          order: 0,
          from: {
            field: cardInfo.fieldName,
            number: cardInfo.fieldNumber,
            order: cardInfo.cardOrder
          }
        }
      }, {
        card: lastCardInfo.card,
        move: {
          field: "foundations",
          number: 1,
          order: 0,
          from: {
            field: lastCardInfo.fieldName,
            number: lastCardInfo.fieldNumber,
            order: lastCardInfo.cardOrder
          }
        }
      });
      this._applyEvents(events);
      return true;
    }

    return false;
  }

  _getCardInfo(id) {
    for (let [index, card] of this.stock.entries()) {
      if (card.id === id)
        return {
          card,
          field: this.stock,
          fieldName: "stock",
          fieldKey: null,
          fieldNumber: 1,
          cardOrder: index
        };
    }
    for (let [index, card] of this.waste.entries()) {
      if (card.id === id)
        return {
          card,
          field: this.waste,
          fieldName: "waste",
          fieldKey: null,
          fieldNumber: 1,
          cardOrder: index
        };
    }
    for (let key in this.foundations) {
      for (let [index, card] of this.foundations[key].entries()) {
        if (card.id === id)
          return {
            card,
            field: this.foundations[key],
            fieldName: "foundations",
            fieldKey: key,
            fieldNumber: parseInt(key.charAt(1), 10),
            cardOrder: index
          };
      }
    }
    for (let key in this.tableau) {
      for (let [index, card] of this.tableau[key].entries()) {
        if (card.id === id) {
          return {
            card,
            field: this.tableau[key],
            fieldName: "tableau",
            fieldKey: key,
            fieldNumber: parseInt(key.split("").splice(1, 2).join(""), 10),
            cardOrder: index,
            fieldRow: this._checkRow(parseInt(key.split("").splice(1, 2).join(""), 10))
          };
        }
      }
    }
    return null;
  }

  _checkRow(fieldNumber) {
    if (fieldNumber == 1) return 1
    else if (fieldNumber >= 2 && fieldNumber <= 3) return 2
    else if (fieldNumber >= 4 && fieldNumber <= 6) return 3
    else if (fieldNumber >= 7 && fieldNumber <= 10) return 4
    else if (fieldNumber >= 11 && fieldNumber <= 15) return 5
    else if (fieldNumber >= 16 && fieldNumber <= 21) return 6
    else if (fieldNumber >= 22 && fieldNumber <= 28) return 7
  }

  _shuffleDeck() {
    for (let i = 0; i < this.stock.length; i++) {
      let randomCard = Math.round(Math.random() * (this.stock.length - 1));
      let temp = this.stock[i];
      this.stock[i] = this.stock[randomCard];
      this.stock[randomCard] = temp;
    }
  }

  _applyEvents(eventList, ignore) {
    if (!ignore) {
      this.appliedEvents.push(eventList);
    }
    this.onChange.dispatch(eventList);
  }

  _checkFinish() {
    //TODO:OVDE MOZI KE IMA POTREBA
    // console.log(this.wasteEmpty);

    let finished = 0
    for (let holder in this.tableau) {
      if (this.tableau[holder].length == 0) finished++
    }

    if (finished >= 28) this.finishGame.dispatch()
    // if (true) this.finishGame.dispatch()
  }
}