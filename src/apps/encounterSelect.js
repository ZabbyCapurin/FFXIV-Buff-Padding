import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    DropdownButton, MenuItem, ControlLabel, Col
} from 'react-bootstrap';

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
        this.handleEncounterSearch = this.handleEncounterSearch.bind(this);
        this.selectedEncounter = this.selectedEncounter.bind(this);
    }
    componentDidMount() {
    }
    handleEncounterSearch() {
        this.setState({ disableSearchButton: true });
        this.props.xivApi.findCharacter(this.encounterSearchInput.value).then(encounter => {
            this.setState({ foundEncounters: encounter.Results, disableSearchButton: false });
        });
    }
    selectedEncounter(selectedEncounters) {
        this.setState({ foundEncounters: [] });
        this.props.encounterSelected(selectedEncounters);
    }
    render() {
        const { zones } = this.props;
        const mappedFoundEncounters = zones.map(zone => {
            const encnts = zone.encounters.map(e =>{
                return (
                    <MenuItem key={e.id} onClick={() => this.selectedEncounter(e)}>
                        { e.name }
                    </MenuItem >
                );
            });
            encnts.unshift(
                <MenuItem key={zone.id} header >
                    { zone.name }
                </MenuItem >
            );
            return encnts;
        });
        return (
            <main id="encounters" className="container-fluid">            
                <Col xs={4} sm={4} md={4} lg={4}>
                    <ControlLabel>Select Encounter: </ControlLabel>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <DropdownButton
                        id="encounterSearch"
                        title="Encounters"
                        ref={ref => { this.encounterSearchInput = ref; }}
                    >
                    {mappedFoundEncounters}
                    </DropdownButton>
                </Col>
            </main>
        );
    }
}

export default EncounterSelect;
