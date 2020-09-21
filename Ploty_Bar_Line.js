define(["qlik", "./plotly", "css!./style.css"], function(qlik, Plotly) {
	return {
		initialProperties: {
			//selectionMode : "CONFIRM",
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 3,
					qHeight: 500
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					uses: "dimensions",
					min: 1,
					max: 2
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1,
					items: {
						type: {
							type: "string",
							label: "Orientation",
							ref: "qAttributeExpressions.0.qExpression",
							defaultValue: "=Red()",
							component: "expression"
						}
					}
				},
				settings: {
					uses: "settings",
					items: {
						fontstyle: {
							type: "items",
							label: "Axis|Chart Fonts & Style",
							items: {
								chart: {
									type: "string",
									component: "dropdown",
									label: "Orientation",
									ref: "ploty.chart",
									options: [{
										value: "bar",
										label: "bar"
									}, {
										value: "line",
										label: "line"
									}],
									defaultValue: "bar"
								},
								fontsize: {
									ref: "ploty.fontsize",
									label: "Font Size",
									type: "string",
									expression: "optional",
									defaultValue: "14"
								},
								fontcolor: {
									ref: "ploty.fontcolor",
									label: "Font Color",
									type: "string",
									expression: "optional",
									defaultValue: "#000"
								},
								//x
								xTitle: {
									ref: "ploty.xTitle",
									label: "X Title",
									type: "string",
									expression: "optional"
								},
								xfontsize: {
									ref: "ploty.xfontsize",
									label: "X Font Size",
									type: "string",
									expression: "optional",
									defaultValue: "14"
								},
								xfontcolor: {
									ref: "ploty.xfontcolor",
									label: "X Font Color",
									type: "string",
									expression: "optional",
									defaultValue: "#000"
								},
								//y
								yTitle: {
									ref: "ploty.yTitle",
									label: "Y Title",
									type: "string",
									expression: "optional"
								},
								yfontsize: {
									ref: "ploty.yfontsize",
									label: "Y Font Size",
									type: "string",
									expression: "optional",
									defaultValue: "14"
								},
								yfontcolor: {
									ref: "ploty.yfontcolor",
									label: "Y Font Color",
									type: "string",
									expression: "optional",
									defaultValue: "#000"
								}
							}
						},
						margin: {
							type: "items",
							label: "Margins",
							items: {
								Left: {
									ref: "ploty.l",
									label: "Left",
									type: "string",
									expression: "optional",
									defaultValue: "55"
								},
								Right: {
									ref: "ploty.r",
									label: "Right",
									type: "string",
									expression: "optional",
									defaultValue: "10"
								},
								Top: {
									ref: "ploty.t",
									label: "Top",
									type: "string",
									expression: "optional",
									defaultValue: "10"
								},
								Bottom: {
									ref: "ploty.b",
									label: "Bottom",
									type: "string",
									expression: "optional",
									defaultValue: "50"
								}
							}
						}
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false,
			viewData: true
		},
		paint: function($element, qlayout) {
			var objID = qlayout.qInfo.qId,
				self = this,
				hypercube = qlayout.qHyperCube,
				qDimensionInfo = hypercube.qDimensionInfo.length,
				dataPoint = null,
				app = qlik.currApp();
			$element.html('<div id="ploty_' + objID + '" style="width: 100%;height: 100%;padding: 0px;"></div>');
			dataPoint = hypercube.qDataPages[0].qMatrix.map(function(v, k) {
				if (qDimensionInfo > 1) {
					return {
						text: v[2].qText,
						x1: v[0].qText,
						x2: v[1].qText,
						y: v[2].qNum,
						color: v[2].qAttrExps.qValues[0].qText
					}
				} else {
					return {
						text: v[1].qText,
						x: v[0].qText,
						y: v[1].qNum,
						color: v[1].qAttrExps.qValues[0].qText
					}
				}
			});
			var x1 = [],
				x2 = [];
			var xValue = dataPoint.map(function(d) {
				if (qDimensionInfo > 1) {
					x1.push([d.x1])
					x2.push([d.x2]);
				} else {
					return d.x;
				}
			});
			if (qDimensionInfo > 1) {
				xValue = [];
				xValue.push(x1);
				xValue.push(x2);
			}
			var data = [{
				x: xValue,
				y: dataPoint.map(function(d) {
					return d.y
				}),
				text: dataPoint.map(function(d) {
					return d.text
				}),
				marker: {
					color: dataPoint.map(function(d) {
						return d.color
					}),
				},
				textposition: 'auto',
				type: qlayout.ploty.chart
			}];
			var layout = {
				width: $('#ploty_' + objID).width() - 10,
				height: $('#ploty_' + objID).height() - 10,
				//paper_bgcolor:'transparent',
				//plot_bgcolor:'transparent',
				dragmode: false,
				autosize: true,
				font: {
					size: qlayout.ploty.fontsize,
					color: qlayout.ploty.fontcolor
				},
				xaxis: {
					title: qlayout.ploty.xTitle,
					tickfont: {
						size: qlayout.ploty.xfontsize,
						color: qlayout.ploty.xfontcolor
					},
					showticklabels: true,
					ticks: "outside",
					tickangle: 'auto',
					showline: true,
					showgrid: qlayout.ploty.xshowgrid,
					gridcolor: qlayout.ploty.xgridcolor,
					gridwidth: qlayout.ploty.xgridwidth
				},
				yaxis: {
					title: qlayout.ploty.yTitle,
					tickfont: {
						size: qlayout.ploty.yfontsize,
						color: qlayout.ploty.yfontcolor
					},
					showticklabels: true,
					ticks: "outside",
					tickangle: 'auto',
					showline: true,
					showgrid: qlayout.ploty.yshowgrid,
					gridcolor: qlayout.ploty.ygridcolor,
					gridwidth: qlayout.ploty.ygridwidth
				},
				margin: {
					l: qlayout.ploty.l,
					r: qlayout.ploty.r,
					b: qlayout.ploty.b,
					t: qlayout.ploty.t,
					pad: 0,
					autoexpand: true
				}
			};
			Plotly.newPlot('ploty_' + objID, data, layout);
			var myPlot = document.getElementById('ploty_' + objID);
			myPlot.on('plotly_click', function(data) {
				var value = '';
				for (var i = 0; i < data.points.length; i++) {
					value = data.points[i].x;
					console.log(value);
				}
				if (qDimensionInfo > 1) {
					value = value[qDimensionInfo - 1];
				} else {
					value = value.split();
				}
				//console.log(value, hypercube.qDimensionInfo[qDimensionInfo - 1].qGroupFieldDefs[0]);
				app.field(hypercube.qDimensionInfo[qDimensionInfo - 1].qGroupFieldDefs[0]).selectValues(value, true, true);
			});
			//needed for export
			return qlik.Promise.resolve();
		}
	};
});