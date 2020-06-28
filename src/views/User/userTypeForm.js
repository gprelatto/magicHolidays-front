import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import FormLabel from "@material-ui/core/FormLabel";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { postUserType, redirectToUnforbidden } from "common/Request/Requests.js";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function UserTypeForm(props) {
    const { t, i18n } = useTranslation();

    const [userType, setUserType] = React.useState('');
    const [percentage, setPercentage] = React.useState('');

    const [bar, setBar] = React.useState(null);
    const [alert, setAlert] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);

    const [userTypeInputState, setUserTypeInputState] = React.useState('');
    const [percentageInputState, setPercentageInputState] = React.useState('');

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
        if (userType === "") {
            setUserTypeInputState("error");
        }
        else {
            setUserTypeInputState("success");
        }
    }, [userType]);

    useEffect(() => {
        if (percentage === "") {
            setPercentageInputState("error");
        }
        else {
            setPercentageInputState("success");
        }
    }, [percentage]);

    const submitButton = () => {
        if (userTypeInputState !== "error"
            && percentageInputState !== "error") {
            progressBar();
            let data = {
                description: userType,
                feePercentage: percentage
            }

            postUserType(data).then((response) => {
                removeProgressBar();
                if (response.data.code === 403) {
                    redirectToUnforbidden(props);
                }
                successAlert()
            }).catch(e => {
                props.history.push('/auth/forbidden')
            });
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function () {
                    setTR(false);
                }, 3000);
            }
        }
    }

    const progressBar = () => {
        setBar(
            <CustomLinearProgress
                variant="indeterminate"
                color="primary"
                value={30}
            />
        );
    };

    const removeProgressBar = () => {
        setBar(null);
    };

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title={t('userType.add.alert.added')}
                onConfirm={() => {
                    setRedirect(<Redirect to='/admin/userTypesTable' />);
                }}
                onCancel={() => {
                    setUserType('');
                    setPercentage('');
                    hideAlert();
                }}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText={t('common.alert.done')}
                cancelBtnText={t('common.alert.addAnother')}
                showCancel
            >
                {t('userType.add.alert.added')}
            </SweetAlert>
        );
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
                {alert}
                {redirect}
                {bar}
                <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                            <MailOutline />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>{t('userType.add.title')}</h4>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        {t('userType.add.userType')}
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={4} sm={4} md={4} lg={8}>
                                    <CustomInput
                                        success={userTypeInputState === "success"}
                                        error={userTypeInputState === "error"}
                                        id='description'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            onChange: event => {
                                                setUserType(event.target.value)
                                            },
                                            value: userType
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>

                            <GridContainer>
                                <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        {t('userType.add.percentage')}
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={4} sm={4} md={4} lg={8}>
                                    <CustomInput
                                        success={percentageInputState === "success"}
                                        error={percentageInputState === "error"}
                                        id='percentage'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            onChange: event => {
                                                let input = event.target.value;

                                                if (input.length > 0) {
                                                    input = input.replace(',', '.')
                                                }

                                                if (!isNaN(input)) {
                                                    setPercentage(input)
                                                }
                                            },
                                            value: percentage
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>

                            <GridContainer>
                                <GridItem xs={10} sm={10} md={10} lg={11}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        <small>*</small> Campos Requeridos
                                </FormLabel>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={10} sm={10} md={10} lg={11}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        <Button
                                            color="rose"
                                            onClick={submitButton}
                                        >
                                            {t('common.button.submit')}
                                        </Button>
                                    </FormLabel>
                                </GridItem>
                            </GridContainer>
                        </form>
                    </CardBody>
                </Card>
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message={t('common.snackbar.missingAlert')}
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
            </GridItem>
        </GridContainer>
    );
}