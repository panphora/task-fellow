import { callSaveFunction } from './js/remake-init';
import './js/user-cookies';
import Sortable from 'sortablejs';


var tackLists = document.querySelectorAll('.tacks');

Array.from(tackLists).forEach(el => {
  var sortable = Sortable.create(el, {
    group: "tacks",
    onEnd: function (event) {
      callSaveFunction({targetElement: el})
    }
  });
});