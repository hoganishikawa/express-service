/* jshint expr: true */
/* jshint -W079 */
/**
 * Created 16 Mar 2015
 */
"use strict";

(function () {
    "use strict";

    var chai = require('chai'),
        expect = chai.expect,
        moment = require("moment");
    var serverRoot = '../../../../../server',
        yeildComparator = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/yeild-comparision-calculator.js");

    describe("assurf yeild compararor", function() {

        describe("calculateDataInterval", function() {

            it("should return answer with necessary fields", function() {
                var init = moment("2015-01-01");
                var result = yeildComparator.calculateDataInterval(init);
                expect(result).to.exist;
                expect(result).to.have.property("startDate");
                expect(result).to.have.property("endDate");
            });

            it("should two years period from given date", function() {
                var init = moment("2015-01-01");
                var result = yeildComparator.calculateDataInterval(init);
                expect(result.endDate.unix()).to.equal(moment("2015-01-01").endOf("month").unix());
                expect(result.startDate.unix()).to.equal(moment("2014-01-01").unix());
            });

            it("should align interval by month", function() {
                var init = moment("2015-01-15");
                var result = yeildComparator.calculateDataInterval(init);
                expect(result.endDate.unix()).to.equal(moment("2015-01-01").endOf("month").unix());
                expect(result.startDate.unix()).to.equal(moment("2014-01-01").unix());
            });

            it("should work with any month", function() {
                var init = moment("2015-03-15");
                var result = yeildComparator.calculateDataInterval(init);
                expect(result.endDate.unix()).to.equal(moment("2015-03-01").endOf("month").unix());
                expect(result.startDate.unix()).to.equal(moment("2014-01-01").unix());
            });
        });

        describe("calculateMonthDataInterval", function() {

            it("should return answer with necessary fields", function() {
                var init = moment("2015-01-01");
                var result = yeildComparator.calculateMonthDataInterval(init);
                expect(result).to.exist;
                expect(result).to.have.property("startDate");
                expect(result).to.have.property("endDate");
            });

            it("should align interval by day", function() {
                var init = moment("2015-02-15");
                var result = yeildComparator.calculateMonthDataInterval(init);
                expect(result.endDate.unix()).to.equal(moment("2015-02-01").endOf("month").unix());
                expect(result.startDate.unix()).to.equal(moment("2015-01-01").unix());
            });

            it("should work on boarders", function() {
                var init = moment("2015-01-01");
                var result = yeildComparator.calculateMonthDataInterval(init);
                expect(result.endDate.unix()).to.equal(moment("2015-01-01").endOf("month").unix());
                expect(result.startDate.unix()).to.equal(moment("2014-12-01").unix());
            });
        });

        describe("transformTempoiqResponse", function() {

            var inputData = {
                "dataPoints": [
                    {
                        "ts": "2014-01-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 1000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 2000
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 3200
                            }
                        }
                    },
                    {
                        "ts": "2014-02-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 3000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 4000
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 5000
                            }
                        }
                    },
                    {
                        "ts": "2014-03-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 6000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 7000
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 8100
                            }
                        }
                    },
                    {
                        "ts": "2014-04-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 9000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 10000
                            },
                            "Envoy:347894": {
                                "powr": 11000
                            },
                            "Envoy:416036": {
                                "powr": 12000
                            },
                            "Envoy:406326": {
                                "powr": 13000
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 14000
                            }
                        }
                    }
                ]
            };

            var nodeList = {
                "WR8KU002:2002126708": {
                    rate: 1
                },
                "WR7KU009:2002112342": {
                    rate: 1
                },
                "Envoy:347894": {
                    rate: 1
                },
                "Envoy:416036": {
                    "rate": 1
                },
                "Envoy:406326": {
                    "rate": 1
                },
                "WR7KU009:2002112282": {
                    "Pac": 1
                }
            };

            it("should return empty result on wrong input", function() {
                var result = yeildComparator.transformTempoiqResponse({}, null, nodeList);
                expect(result).a("object");
                expect(result).to.be.empty;
            });

            it("should aggrergagte data and sum by time", function() {

                var result = yeildComparator.transformTempoiqResponse(inputData, null, nodeList);
                expect(result).a("object");
                expect(result).to.have.property("Jan 14");
                expect(result["Jan 14"]).to.deep.equal({ energy: 6.2, cost: 6.2});
                expect(result).to.have.property("Feb 14");
                expect(result["Feb 14"]).to.deep.equal({ energy: 12, cost: 12});
                expect(result).to.have.property("Mar 14");
                expect(result["Mar 14"]).to.deep.equal({ energy: 21.1, cost: 21.1});
                expect(result).to.have.property("Apr 14");
                expect(result["Apr 14"]).to.deep.equal({ energy: 69, cost: 69});
            });


            var dailyInputData = {
                "dataPoints": [
                    {
                        "ts": "2015-02-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 1000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 1000
                            },
                            "Envoy:347894": {
                                "powr": 1000
                            },
                            "Envoy:416036": {
                                "powr": 1000
                            }
                        }
                    },
                    {
                        "ts": "2015-02-02T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 2100
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 2000
                            }
                        }
                    },
                    {
                        "ts": "2015-02-03T00:00:00.000Z",
                        "values": {
                            "Envoy:416036": {
                                "powr": 3000
                            },
                            "Envoy:415544": {
                                "powr": 3000
                            },
                            "Envoy:406326": {
                                "powr": 3000
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 3100
                            }
                        }
                    },
                    {
                        "ts": "2015-02-04T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 4000
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 4000
                            },
                            "Envoy:347894": {
                                "powr": 4000
                            },
                            "Envoy:416036": {
                                "powr": 4000
                            }
                        }
                    }
                ]
            };

            var nodeList = {
                "WR8KU002:2002126708": {
                    rate: 1
                },
                "WR7KU009:2002112342": {
                    rate: 1
                },
                "Envoy:347894": {
                    rate: 1
                },
                "Envoy:416036": {
                    "rate": 1
                },
                "Envoy:406326": {
                    "rate": 1
                },
                "WR7KU009:2002112282": {
                    "rate": 1
                },
                "Envoy:415544": {
                    "rate": 1
                },
            };

            it("should aggregate daily results", function() {
                var result = yeildComparator.transformTempoiqResponse(dailyInputData, function(ts) {
                    return moment(ts).format("DD-MM");
                }, nodeList);
                expect(result).a("object");
                expect(result).to.have.property("01-02");
                expect(result["01-02"]).to.deep.equal({energy: 4, cost: 4});
                expect(result).to.have.property("01-02");
                expect(result["02-02"]).to.deep.equal({energy: 4.1, cost: 4.1});
                expect(result).to.have.property("02-02");
                expect(result["03-02"]).to.deep.equal({energy: 12.1, cost: 12.1});
                expect(result).to.have.property("04-02");
                expect(result["04-02"]).to.deep.equal({energy: 16, cost: 16});
            });

        });

        describe("hasFullPreviousYear", function() {

            it("should return false if has not all previous year", function() {
                var obj = {
                    "Jan 14": 1,
                    "Feb 14": 2,
                    "Mar 14": 3
                };
                var result = yeildComparator.hasFullPreviousYear(obj, moment("2015-01-01"));
                expect(result).to.be.equal(false);
            });

            it("should return true if has not all previous year", function() {
                var obj = {
                    "Jan 14": 1,
                    "Feb 14": 2,
                    "Mar 14": 2,
                    "Apr 14": 2,
                    "May 14": 2,
                    "Jun 14": 2,
                    "Jul 14": 2,
                    "Aug 14": 2,
                    "Sep 14": 2,
                    "Oct 14": 3,
                    "Nov 14": 2,
                    "Dec 14": 2
                };
                var result = yeildComparator.hasFullPreviousYear(obj, moment("2015-01-01"));
                expect(result).to.be.equal(true);
            });

        });
    });




})();

