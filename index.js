"use strict";
const async = require('async');
const LoadBalancer = require('./lib/LoadBalance');

/**
 * This module works like a middleware to a specified source and
 * requests resource from a mirrored source with no-op callbacks
 *
 * Reason: this is useful for pre-production tests with new services
 * to observe behaviour with production load before release
 *
 * @param tilelive
 * @param options
 * @returns {Mirror}
 */
module.exports = function (tilelive, options) {
    const Switch = function (uri, callback) {
        const self = this;
        // TODO: support slow switch to mirrored source
        self.enableMirror = uri.query.enableMirror || false;
        const lbOptions = uri.query.loadBalancer || {};
        self.lb = new LoadBalancer(lbOptions);

        async.waterfall([
            async.apply(tilelive.load, uri.query.source),
            (tlsource, done) => {
                self.source = tlsource;
                done();
            },
            async.apply(tilelive.load, uri.query.mirror),
            (mirrorSource, done) => {
                self.mirror = mirrorSource;
                done();
            }
        ], () => {
            return callback(null, self);
        });
    }

    Switch.prototype.getTile = function(z, x, y, callback) {
        if (this.enableMirror && this.lb.enableSecondaryLoad()) {
            // Request the mirrored tile with no-op callback
            // TODO: is it possible that this will create a memory leak?
            this.mirror.getTile(z, x, y, () => {});
        }
        this.source.getTile(z, x, y, callback);
    }
    Switch.prototype.getInfo = function(callback) {
        // Ignore mirror source info
        this.source.getInfo(callback);
    }
    Switch.prototype.close = function(callback) {
        return callback && setImmediate(callback);
    }
    Switch.registerProtocols = function(tilelive) {
        tilelive.protocols["switch:"] = Switch;
    }

    Switch.registerProtocols(tilelive);

    return Switch;
}
