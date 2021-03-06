'use strict';
let pagination = require('./pagination');

/**
 * Retrieve the project name given its project ID and the associated url. After appending the appropriate suffix to
 * complete the request URL, pagination is called and returns the name of the project from the given arguments. If the
 * promise is resolved, the project name is returned. Else the rejected promise issues a message String used for error
 * logging.
 *
 * @param {Number} projectId
 * @param {String} url Should be in the following format: http://username:password@teamname.jamacloud.com/rest/latest/
 */
function getProjectName (projectId, url) {
  let newUrl = url + 'projects/' + projectId;
  let name = pagination(newUrl, 0, Number.MAX_SAFE_INTEGER);
  return name.then((item) => {
    // pagination stores payload in an array
    return item[0].fields.name;
  }, () => Promise.reject('Promise for name has been rejected.'));
}

/**
 * Retrieve all items from some project given its project ID and the associated url. Prior to calling the pagination
 * function, `url` is appended with the appropriate suffix to complete the request URL for all project items. If the
 * promise is resolved, each iteration through the list of items pushes the ID, name, and item type into a temporary
 * node container, which ultimately becomes the value of the `nodes` data member. Else the rejected promise issues a
 * message String used for error logging.
 *
 * @param {Number} projectId
 * @param {String} url Should be in the following format: http://username:password@teamname.jamacloud.com/rest/latest/
 */
function getProjectItems (projectId, url) {
  let newUrl = url + 'items?project=' + projectId;
  let nodeItems = pagination(newUrl, 0, Number.MAX_SAFE_INTEGER);
  return nodeItems.then((items) => {
    let tempNodeCont = [];
    items.forEach((item) => {
      let node = {
        'id': item.id,
        'name': item.fields.name,
        'type': item.itemType
      };
      tempNodeCont.push(node);
    });
    return tempNodeCont;
  }, () => Promise.reject('Promise for nodes has been rejected.'));
}

/**
 * Retrieve all item relationships from some project given its project ID and the associated url. Prior to calling the
 * pagination function, `url` is appended with the appropriate suffix to complete the request URL for all project item
 * relationships. If the promise is resolved, each iteration through the list of item relationships pushes the ID, the
 * IDs of both items in the relationship, and relationship type into a temporary edge container, which ultimately
 * becomes the value of the `edges` data member. Else the rejected promise issues a message String used for error
 * logging.
 *
 * @param {Number} projectId
 * @param {String} url Should be in the following format: http://username:password@teamname.jamacloud.com/rest/latest/
 */
function getProjectRelationships (projectId, url) {
  let newUrl = url + 'relationships?project=' + projectId;
  let relationshipItems = pagination(newUrl, 0, Number.MAX_SAFE_INTEGER);
  return relationshipItems.then((items) => {
    let tempEdgeCont = [];
    items.forEach((item) => {
      let edge = {
        'id': item.id,
        'fromItem': item.fromItem,
        'toItem': item.toItem,
        'type': item.relationshipType
      };
      tempEdgeCont.push(edge);
    });
    return tempEdgeCont;
  }, () => Promise.reject('Promise for edges has been rejected.'));
}

module.exports = {
  getProjectName: getProjectName,
  getProjectItems: getProjectItems,
  getProjectRelationships: getProjectRelationships
};
