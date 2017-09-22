
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Icon, Button, Left, Right, Body, Header, Text, Footer, FooterTab, Grid, Row, Col } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

class FooterContent extends Component {


  render() {
    return (
      <Footer style={styles.footer}>
       <FooterTab style={styles.footerTab}>
         <Grid>
         <Row>
           <Col>
              <Button style={styles.roundedButtonFooter}  vertical  onPress={() => { Actions.home(); }}>
                <Icon style={styles.iconFooter} name="ios-calendar-outline" />
              </Button>
              <Text note style={styles.buttonLabelFooter}>Calendar</Text>
            </Col>
          </Row>
        </Grid>

        <Grid>
        <Row>
          <Col>
             <Button style={styles.roundedButtonFooter} vertical  onPress={() => { Actions.webportal(); }}>
               <Icon style={styles.iconFooter} name="ios-grid" />
             </Button>
             <Text note style={styles.buttonLabelFooter}>myStamford</Text>
         </Col>
       </Row>
     </Grid>

           <Grid>
           <Row>
             <Col>

         <Button style={styles.roundedButtonFooter} vertical onPress={() => { Actions.webportalSports(); }} >
             <Icon style={styles.iconFooter} name="ios-football-outline" />
         </Button>

         <Text note style={styles.buttonLabelFooter}>Athletics</Text>

         </Col>
       </Row>
     </Grid>


           <Grid>
           <Row>
             <Col>


         <Button  style={styles.roundedButtonFooter} vertical  onPress={() => Actions.homeNav()}>
           <Icon style={styles.iconFooter} name="ios-home" />
         </Button>
         <Text  note style={styles.buttonLabelFooter}>More</Text>
         </Col>
       </Row>
     </Grid>

       </FooterTab>
     </Footer>


    );
  }
}

export default connect()(FooterContent);
