import './js/user-cookies';
import { init, getDataFromRootNode, callSaveFunction } from 'remakejs/dist/bundle.es6';
import Sortable from 'sortablejs';

// init remake
init({
  addItemCallback: function ({itemElem, templateName}) {
    let stackElem = itemElem;
    
    if (templateName === "stack") {
      var sortable = Sortable.create(stackElem.querySelector(".tacks"), {
        group: "tacks",
        onEnd: function (event) {
          callSaveFunction({targetElement: stackElem})
        }
      });
    }
  }
});


// init sortable

var tackLists = document.querySelectorAll('.tacks');

Array.from(tackLists).forEach(tacksListElem => {
  var sortable = Sortable.create(tacksListElem, {
    group: "tacks",
    onEnd: function (event) {
      callSaveFunction({targetElement: tacksListElem})
    }
  });
});


window.getDataFromRootNode = getDataFromRootNode;













