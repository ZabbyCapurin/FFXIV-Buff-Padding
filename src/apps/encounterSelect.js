import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { groupBy, map } from 'lodash';
import {
    ControlLabel, Col
} from 'react-bootstrap';
import { Typeahead, Menu, MenuItem, Highlighter } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../styles/encounterSelect.css';

class EncounterSelect extends Component {
    static propTypes = {
        zones: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                frozen: PropTypes.bool,
                encounters: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.number,
                        name: PropTypes.string
                    })
                ),
                brackets: PropTypes.shape({
                    min: PropTypes.number,
                    max: PropTypes.number,
                    bucket: PropTypes.number,
                    type: PropTypes.string
                })
            })
        ).isRequired,
        encounterSelected: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props);        
        this.state = {
            foundEncounters: []
        };
        this.selectedEncounter = this.selectedEncounter.bind(this);
        this.renderMenuItems = this.renderMenuItems.bind(this);
    }
    componentDidMount() {
    }
    selectedEncounter(selectedEncounters) {
        this.setState({ foundEncounters: [] });
        if (this.selectedEncounter.length > 0) {
            this.props.encounterSelected(selectedEncounters[0]);
        }
    }
    renderMenuItems(results, menuProps) {
        let idx = 0;
        const grouped = groupBy(results, (r) => r.zoneName);
        const items = Object.keys(grouped).sort().map(zone => {
            const encnts = map(grouped[zone], (e => {
                const item =(
                    <MenuItem key={e.value} option={e} position={idx}>
                        <Highlighter search={menuProps.label}>
                            { e.label }
                        </Highlighter>
                    </MenuItem >
                );
                idx += 1;
                return item;
            }));

            let zoneName = zone.replace(/[\W_]+/g, '-');
            if (zoneName.slice(-1) === '-') {
                zoneName = zoneName.slice(0, -1);
            }
            const header = (                
                <Menu.Header key={`${zoneName}-header`}>
                    { zone }
                </Menu.Header>
            );
            const divider = !!idx && <Menu.Divider key={`${zoneName}-divider`} />;
            return [
                divider,
                header,
                encnts
            ]
        });
        return <Menu {...menuProps}>{items}</Menu>;
    }
    render() {
        const { zones } = this.props;
        const options = zones.reduce((zoneHolder, zone) => {
            const encounters = zone.encounters.map(e =>{
                return {
                    value: e.id,
                    label: e.name,
                    zone: zone,
                    zoneName: zone.name
                };
            });
            return encounters.concat(zoneHolder);
        }, []);

        return (
            <main id="encounters" className="container-fluid">            
                <Col xs={4} sm={4} md={4} lg={4}>
                    <ControlLabel>Select Encounter: </ControlLabel>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <Typeahead
                        id="encounterSearch"
                        options={options}
                        placeholder="Choose an Encounter..."
                        onChange={this.selectedEncounter}
                        renderMenu={this.renderMenuItems}
                    />
                </Col>
            </main>
        );
    }
}

export default EncounterSelect;
