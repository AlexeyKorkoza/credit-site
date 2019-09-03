import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import SimpleReactValidator from 'simple-react-validator';
import ReactNotification from 'react-notifications-component';

import Steps from '../../components/Loans/Add';

import { getDataAuthUser } from "../../services/localDb";
import { getClient, getClientLoans } from "../../api/clients";
import { createClientCard } from "../../api/client_card";
import { saveLoan } from '../../api/loans';
import buildNotification from "../../services/notification";
import Validator from "../../shared/Validator";
import calculateTotalRepaymentAmount from "../../services/calculation";

const { Step1, Step2 } = Steps;
const components = {
    1: Step1,
    2: Step2,
};

class Add extends Component {
    notificationDOMRef = React.createRef();
    timer = null;
    validator = new SimpleReactValidator({
        element: message => <Validator>{message}</Validator>
    });

    state = {
        email: '',
        fullName: '',
        phone: '',
        selectedTerritory: {},
        passportData: '',
        surchargeFactor: 0,

        clientId: null,
        clientName: '',

        currentStep: 1,

        amount: 0,
        dateIssue: null,
        dateMaturity: null,
        totalRepaymentAmount: 0,
        territories: [
            {
                label: '0.5 %',
                value: '0.5',
            },
            {
                label: '1 %',
                value: '1',
            },
            {
                label: '1.5 %',
                value: '1.5',
            },
        ],

        loans: [],
        role: '',
        focusedDateMaturity: null,
        focusedDateIssue: null,
        failureNotificationType: 'FailureCreatingLoan',
        successfulNotificationType: 'SuccessfulCreatingLoan',
    };

    componentDidMount() {
        const {
            location: {
                state,
            },
        } = this.props;

        const { role } = getDataAuthUser();
        const newStateData = {
            role,
        };

        if (state) {
            const { clientId } = state;
            newStateData.clientId = clientId;

            getClient(clientId)
                .then(result => {
                    const { territories } = this.state;
                    const { client } = result;
                    const selectedTerritory = territories.find(e => +e.value === +client.territory);
                    const { name: clientName } = client;

                    this.setState({
                        ...newStateData,
                        ...client,
                        clientName,
                        selectedTerritory,
                    });
                });
        }

        this.setState({ ...newStateData });
    }

    componentWillMount() {
        clearTimeout(this.timer);
    }

    onBack = () => {
        this.props.history.goBack();
    };

    onChangeInput = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    onChangeTerritory = selectedTerritory => {
        this.setState({
            selectedTerritory,
        });
    };

    onCreateClientCard = event => {
        event.preventDefault();

        const {
            email,
            fullName,
            phone,
            selectedTerritory,
            passportData,
            clientId,
            surchargeFactor,
            territories,
        } = this.state;

        const territory = territories.find(e => +e.value === +selectedTerritory.value).value;

        const body = {
            email,
            fullName,
            phone,
            territory,
            passportData,
            clientId,
            surchargeFactor,
        };

        createClientCard(body)
            .then(() => getClientLoans(clientId))
            .then(result => {
                const { loans } = result;

                this.setState({
                    amount: surchargeFactor,
                    currentStep: 2,
                    loans,
                });
            });
    };

    onCreateLoan = event => {
        event.preventDefault();

        const {
            amount,
            selectedTerritory,
            dateIssue,
            dateMaturity,
            clientId,
            territories,
            totalRepaymentAmount,
            failureNotificationType,
            successfulNotificationType,
        } = this.state;

        const territory = territories.find(e => +e.value === +selectedTerritory.value);

        const body = {
            amount,
            coefficient: territory,
            clientId,
            dateIssue,
            dateMaturity,
            totalRepaymentAmount,
        };

        return saveLoan(body)
            .then(() => {
                const message = 'Loan was created successfully';
                const notification = buildNotification(message, successfulNotificationType);
                if (notification) {
                    this.notificationDOMRef.current.addNotification(notification);
                }

                this.timer = setTimeout(() => {
                    this.props.history.push('/clients');
                }, 3000);
            })
            .catch(error => {
                const { message } = error;
                const notification = buildNotification(message, failureNotificationType);
                if (notification) {
                    this.notificationDOMRef.current.addNotification(notification);
                }
            });
    };

    onChangeDateIssue = dateIssue => {
        const { dateMaturity } = this.state;

        const result = calculateTotalRepaymentAmount(dateIssue, dateMaturity, this.state);

        this.setState(result);
    };

    onChangeDateMaturity = dateMaturity => {
        const { dateIssue } = this.state;

        const result = calculateTotalRepaymentAmount(dateIssue, dateMaturity, this.state);

        this.setState(result);
    };

    onFocusedDateIssue = ({ focused }) => {
        this.setState({
            focusedDateIssue: focused,
        });
    };

    onFocusedDateMaturity = ({ focused }) => {
        this.setState({
            focusedDateMaturity: focused,
        });
    };

    render() {
        const { currentStep } = this.state;
        const CurrentComponent = components[currentStep];

        return (
            <Fragment>
                <ReactNotification ref={this.notificationDOMRef} />
                <CurrentComponent
                    data={this.state}
                    onBack={this.onBack}
                    onChangeDateIssue={this.onChangeDateIssue}
                    onChangeDateMaturity={this.onChangeDateMaturity}
                    onCreateClientCard={this.onCreateClientCard}
                    onCreateLoan={this.onCreateLoan}
                    onChangeInput={this.onChangeInput}
                    onChangeTerritory={this.onChangeTerritory}
                    onFocusedDateIssue={this.onFocusedDateIssue}
                    onFocusedDateMaturity={this.onFocusedDateMaturity}
                    validator={this.validator}
                />
            </Fragment>
        );
    }
}

export default withRouter(Add);