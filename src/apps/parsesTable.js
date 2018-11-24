import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';

class ParsesTable extends Component {
    static propTypes = {
      parses: PropTypes.array.isRequired
    }
    static getGetOrdinal(n) {
      let s = [ 'th', 'st', 'nd', 'rd' ],
          v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    static dateFormatter(cell, row) {
      const { duration } = row;
      const startDate = moment(cell).format('YYYY/MM/DD HH:mm:ss');
      const endDate = moment(cell + duration).format('HH:mm:ss');
      return `${startDate} - ${endDate}`;
    }
    static rankFormatter(cell, row) {
      const { outOf } = row;
      return `${cell} / ${outOf}`;
    }
    static percentileFormatter(cell, row) {
      return `${ParsesTable.getGetOrdinal(cell)}`;
    }
    constructor(props) {
      super(props);
      this.state = {
        expanded: [ 0, 1 ],
        parses: props.parses,
        fights: {}
      };
      this.handleOnExpand = this.handleOnExpand.bind(this);
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
      if (isExpand) {
        const { reportID } = row;
        this.ffLog.getFights(reportID)
          .then(fights => {
            let fightsClone = JSON.parse(JSON.stringify(this.state.fights));
            fightsClone[reportID] = fights;
            fightsClone[reportID].events = [];
            this.setState({ fights: fightsClone });

            const { fights: allFights } = fights;
            for (let n = 0, fightsCount = allFights.length; n < fightsCount; n += 1) {
              const { start_time, end_time } = allFights[n];
              this.ffLog.getEvents(row.reportID, start_time, end_time).then(events => {
                fightsClone[reportID].events.push(events);
                this.setState({ fights: fightsClone });
              });
            }
          });
        this.setState(() => ({
          expanded: [ ...this.state.expanded, row.id ]
        }));
      } else {
        this.setState(() => ({
          expanded: this.state.expanded.filter(x => x !== row.id)
        }));
      }
    }

    render() {
      const { parses }= this.state;

      const expandColumns = [
        {
          dataField: 'rank',
          text: 'Rank',
          formatter: ParsesTable.rankFormatter
        }, {
          dataField: 'percentile',
          text: 'Percentile',
          formatter: ParsesTable.percentileFormatter
        }, {
          dataField: 'startTime',
          text: 'Start - End',
          formatter: ParsesTable.dateFormatter
        }, {
          dataField: 'reportID',
          text: 'Report ID'
        }
      ];
      const expandRow = {
        renderer: row => (
          <BootstrapTable
            keyField='id'
            data={parses.fights}
            columns={expandColumns}
            expandRow={expandRow}
          />
        ),
        expanded: this.state.expanded,
        onExpand: this.handleOnExpand
      };

      const columns = [
        {
          dataField: 'rank',
          text: 'Rank',
          formatter: ParsesTable.rankFormatter
        }, {
          dataField: 'percentile',
          text: 'Percentile',
          formatter: ParsesTable.percentileFormatter
        }, {
          dataField: 'startTime',
          text: 'Start - End',
          formatter: ParsesTable.dateFormatter
        }, {
          dataField: 'reportID',
          text: 'Report ID'
        }
      ];
      return(
        <BootstrapTable
          keyField='id'
          data={parses}
          columns={columns}
          expandRow={expandRow}
        />
      );
    }
}

export default ParsesTable;
