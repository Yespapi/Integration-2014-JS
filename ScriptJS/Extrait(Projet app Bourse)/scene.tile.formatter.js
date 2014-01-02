﻿//Handles specialized rendering tasks required by some
//tiles such as the video tile, quote tile (uses canvas),
//etc.
var tileFormatter = new function () {
    var previousPoint = null,
        tmplSizes = ['Small', 'Medium', 'Large'],
        raphael = Raphael.ninja(),

        formatVideo = function (tileDiv) {
            if (!Modernizr.video) return;
            var scene = tileDiv.data().scenes[0];
            var player = $('#VideoPlayer');
            var videoRatio = 2.43;
            var videoHeight = Math.round(scene.height * .75);
            var videoWidth = Math.round(videoHeight * videoRatio);
            if (videoWidth > scene.width) videoWidth = scene.width - 20;

            player.css({ height: videoHeight + 'px', width: videoWidth + 'px' });

            player.bind('click mousedown mouseup mousemove mouseenter mouseleave', function (e) {
                e.stopPropagation();
            });

            //Uncomment the following to add VideoJS features (and ensure you uncomment the CSS and script in the layout file)

            //$('.VideoPlayerDiv').css('width',videoWidth + 'px');
            //window.setTimeout(function() {   //Delay load video player to give video tag time to calc dimensions and render         
            //    player.VideoJS();
            //    $('.vjs-fullscreen-control').click(function() {
            //        player.css('width','100%');
            //    });
            //}, 1500); 
        },

        formatQuote = function () {
            var quoteBtn = $('#QuoteButton');
            var quoteTxt = $('#QuoteTextBox');
            var quoteTile = $('#Quote');

            var sym = quoteTile.data().symbol;
            if (sym != null) {
                quoteTxt.val(sym);
            } else {
                quoteTxt.val('msft');
            }

            var clickHandler = function () {
                var quotSym = quoteTxt.val();
                if (quotSym != '') {
                    dataService.getQuote(quotSym, tileFormatter.formatQuoteData);
                }

                quoteTile.data().symbol = quoteTxt.val();
            };

            quoteBtn.click(function () {
                clickHandler();
            });

            quoteTxt.keyup(function (e) {
                if (e.keyCode == 13) {
                    clickHandler();
                }
            });

            if (quoteBtn.is(':visible')) {
                quoteBtn.trigger('click');
            }
        },

        formatQuoteData = function (json) {
            var quoteTileDiv = $('#Quote');
            var quoteData = $('#QuoteDataContainer');
            quoteData.html('');

            $('#QuoteDataTemplate_' + tmplSizes[quoteTileDiv.data().scenes[0].size]).tmpl(json).appendTo(quoteData);

            if (Modernizr.canvas) {

                //Render canvas
                var canvasDiv = $('#QuoteCanvas');
                if (canvasDiv.length > 0) {
                    canvasDiv.html('');
                    var width = quoteTileDiv.data().scenes[0].width * .95;
                    var height = quoteTileDiv.data().scenes[0].height * .52;
                    renderCanvas(canvasDiv, width, height, '#6699FF', json, json.DataPoints);
                }
            }

            quoteTileDiv.find('.Currency').formatCurrency({ symbol: '' });
        },

        formatMarketData = function (marketTileDiv) {
            var tileId = marketTileDiv.attr('id');

            if (Modernizr.canvas) {
                var canvasDiv = $('#' + tileId + 'Canvas');
                if (canvasDiv.length > 0) {
                    canvasDiv.html('');
                    //Render canvas
                    var size = marketTileDiv.data().scenes[0].size;
                    var heightMultiplier = (size == 1) ? .55 : .72;
                    var width = marketTileDiv.data().scenes[0].width * .94;
                    var height = marketTileDiv.data().scenes[0].height * heightMultiplier;
                    var json = marketTileDiv.data().tileData;
                    renderCanvas(canvasDiv, width, height, marketTileDiv.data().chartColor, json[tileId], json[tileId + 'DataPoints']);
                }
            }

            marketTileDiv.find('.Currency').formatCurrency({ symbol: '' });
            $('div.MarketQuoteLast').formatCurrency({ symbol: '' });
        },

        renderCanvas = function (canvasDiv, width, height, color, itemJson, dataPointsJson) {
            if (dataPointsJson != null && dataPointsJson.length > 0) {
                var quoteData = [];
                for (var i in dataPointsJson) {
                    var dp = dataPointsJson[i];
                    quoteData.push([dp.JSTicks, dp.Value]);
                }
                var maxY = itemJson.Last + (itemJson.Last * .3);

                //Add plot()
                var chartOptions = {
                    series: {
                        lines: { show: true, fill: true },
                        points: { show: true, radius: 5 }
                    },
                    grid: { hoverable: true, autoHighlight: true },
                    legend: { position: 'se' },
                    yaxis: { max: maxY, min: 0 },
                    xaxis: { minTickSize: [1, 'hour'], mode: 'time', timeformat: '%h %P', twelveHourClock: true }
                };

                canvasDiv.attr('style', 'width:' + width + 'px;height:' + height + 'px;');

                $.plot(canvasDiv, [{
                    color: color,
                    shadowSize: 4,
                    label: 'Simulated Data',
                    data: quoteData
                }], chartOptions);

                canvasDiv.bind('plothover', function (event, pos, item) {
                    if (item) {
                        if (previousPoint != item.datapoint) {
                            previousPoint = item.datapoint;

                            $('#CanvasTooltip').remove();
                            //var x = item.datapoint[0].toFixed(2),
                            var y = item.datapoint[1].toFixed(2);

                            showTooltip(item.pageX, item.pageY, y);
                        }
                    }
                    else {
                        $("#CanvasTooltip").remove();
                        previousPoint = null;
                    }
                });
            }
        },

        showTooltip = function (x, y, contents) {
            $('<div id="CanvasTooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 15,
                border: '1px solid #000',
                padding: '2px',
                'background-color': '#fee',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        },

        formatAccountDetails = function (tileDiv) {
            tileDiv.find('.Currency').formatCurrency();
            var scene = tileDiv.data().scenes[0];

            if (Modernizr.inlinesvg) {
                if ($('#AccountPositionsSVG').length > 0) {
                    var values = [];
                    var labels = [];
                    $(tileDiv.data().tileData.Positions).each(function () {
                        labels.push(this.Security.Symbol + '\r\n' + this.Shares + ' shares');
                        values.push(this.Shares);
                    });
                    raphael('AccountPositionsSVG', 500, 420)
                    .pieChart(scene.width / 2,
                              scene.height / 4 + 10, 66,
                              values, labels, "#fff");
                }
            }
        },

        formatAccountPositions = function (tileDiv) {
            tileDiv.find('.Currency').formatCurrency({ roundToDecimalPlace: 0 });

            var accountTable = $('#' + tileDiv.attr('id') + 'Table');
            if (accountTable.length > 0) {
                accountTable.dataTable({
                    'bPaginate': false,
                    'bLengthChange': false,
                    'bFilter': false,
                    'bInfo': false,
                    "bRetrieve": true,
                    'aoColumns': [null, null, null, null, null, null, { 'sType': 'currency'}]
                });
            }
        };

    return {
        formatVideo: formatVideo,
        formatAccountDetails: formatAccountDetails,
        formatAccountPositions: formatAccountPositions,
        formatQuote: formatQuote,
        formatQuoteData: formatQuoteData,
        formatMarketData: formatMarketData
    };

} ();