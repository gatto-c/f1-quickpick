"use strict";

const request = require("koa-request");
const samples = require('data-access/samples-generator');

/**
 * resolveRequest
 * Proxy a request through to the microservice that resolves it.
 *
 * @param string host
 * @param string action
 * @param array args
 */
function* resolveRequest(host, action, args) {
  var path = "/rest/" + action + "/";
  if(!host) {
      throw new Error("unknown service " + service);
  }
  if(args) {
    path = path + args.join("/");
  }

  var response = yield request({
    headers: {"Content-Type": "application/json"},
    url: host+path
  });

  this.body = response.body;
}

/**
 * resolveRequestPut
 * Proxy a put request through to the microservice that resolves it.
 *
 * @param string host
 * @param string action
 * @param array args
 */
function* resolveRequestPut(host, action, args) {
  var path = "/rest/" + action + "/";
  if(!host) {
    throw new Error("unknown service " + service);
  }
  if(args) {
    path = path + args.join("/");
  }
  const puttedJson = this.body || {};

  const response = yield request.put({
    headers: {"Content-Type": "application/json"},
    url: host + path,
    json: puttedJson
  });

  this.body = response.body;
}

/**
 * resolveRequestPost
 * Proxy a post request through to the microservice that resolves it.
 *
 * @param string host
 * @param string action
 * @param array args
 */
function* resolveRequestPost(host, action, args) {
  var path = "/rest/" + action + "/";

  if(!host) {
    throw new Error("unknown service " + service);
  }
  if(args) {
    path = path + args.join("/");
  }
  const postedJson = this.body || {};

  const response = yield request.post({
    headers: {"Content-Type": "application/json"},
    url: host + path,
    json: postedJson
  });

  this.body = response.body;
}

/**
 * resolveRequest
 * Proxy action for microservice class-action-rest-api.  Uses session
 * to inject clientId into any microservice requests needing it.
 *
 * @author Evan King
 * @param string action Name of the action to call from the microservice
 * @param int caseId Id value only required for microservice routes that use it
 */
module.exports.resolveRequest = function*() {
  var gen = samples.getSample(this.params.id);
  this.body = gen.next().value;
};
