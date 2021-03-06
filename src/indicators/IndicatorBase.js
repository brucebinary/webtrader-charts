import _ from 'lodash';
import {uuid, toFixed} from '../common/utils.js';
/**
 * Created by Arnab Karmakar on 1/16/16.
 */
/**
 * Initialize a new indicator object
 * @param data in [{time, open, high, low, close}, {time, open, high, low, close}] format
 * @param options - Indicator parameters passed from UI (user selection)
 * @constructor
 */
var IndicatorBase = function(data, options, indicators) {

    this.options = options;
    //Calculate the initial value and store locally
    this.indicatorData = [];
    /*
        This variable can also contain array of IDs, for example BBANDs indicator
     */
    this.uniqueID = uuid();
    this.indicators = indicators;

};

/**
 * Adds a new Indicator point at the end
 * This can return [ { time : , value : []}] - Meaning, the value can also return array of
 *                                              values, for example BBANDS indicator
 *                                              Value can also be an instance of CDLUpdateObject, for example all the CDL indicators
 * @param data
 * @returns {*[]}
 */
IndicatorBase.prototype.addPoint = function(data) {
    return [];
};

/**
 * Updates the last Indicator point
 * This can return [ { time : , value : []}] - Meaning, the value can also return array of
 *                                              values, for example BBANDS indicator
 *                                              Value can also be an instance of CDLUpdateObject, for example all the CDL indicators
 * @param data
 * @returns {*[]}
 */
IndicatorBase.prototype.update = function(data) {
    return [];
};

/**
 * @returns {string}
 */
IndicatorBase.prototype.toString = function() {
    return 'IndicatorBase';
};

/**
 * @param indicatorMetadata
 * @returns {*[]}
 */
IndicatorBase.prototype.buildSeriesAndAxisConfFromData = function(indicatorMetadata) {
    var data = [];
    //Prepare the data before sending a configuration
    this.indicatorData.forEach(function(e) {
        data.push([e.time, e.value]);
    });
    var confObject = {
        axisConf : { // Secondary yAxis
            id: indicatorMetadata.id + '-' + this.uniqueID,
            title: {
                text: this.toString(),
                align: 'high',
                offset: 0,
                rotation: 0,
                y: 10, //Trying to show title inside the indicator chart
                x: 30+ this.toString().length * 7.5
            },
            lineWidth: 2,
            plotLines: this.options.levels,
            plotBands :this.options.plotBands
        },
        seriesConf : {
            id: this.uniqueID,
            name: this.toString(),
            data: data,
            type: 'line',
            yAxis: indicatorMetadata.id + '-' + this.uniqueID,
            color: this.options.stroke,
            lineWidth: this.options.strokeWidth,
            dashStyle: this.options.dashStyle
        }
    };
    if (indicatorMetadata.onChartIndicator) {
        delete confObject.axisConf;
        delete confObject.seriesConf.yAxis;
        confObject.seriesConf.onChartIndicator = true;
    }
    return [confObject];
};

/**
 * This method will return all IDs that are used to identify data series configuration
 * in the buildSeriesAndAxisConfFromData method.
 * @returns {*[]}
 */
IndicatorBase.prototype.getIDs = function() {
    return [this.uniqueID];
};

/**
 * If all the unique IDs generated by this instance is same as what is passed in the parameter,
 * then we consider this instance to be same as what caller is looking for
 * @param uniqueIDArr
 * @returns {boolean}
 */
IndicatorBase.prototype.isSameInstance = function(uniqueIDArr) {
    return _.isEqual(uniqueIDArr.sort(), [this.uniqueID]);
};

window.IndicatorBase = IndicatorBase;
