import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import {
    Button,
    Card,
    Error,
    Input,
} from '../../shared';

const Manager = props => {
    const {
        onSave,
        onChangeInput,
        onChangePassword,
        onChangeTerritory,
        data: {
            login,
            fullName,
            phone,
            email,
            oldPassword,
            newPassword,
            confirmNewPassword,
            territories,
            selectedTerritory,
            isEmptyPasswordsFields,
            isEqualNewPasswords,
        },
        validatorProfile,
    } = props;

    if (!validatorProfile.allValid()) {
        validatorProfile.showMessages();
    }

    return (
      <Card.List>
        <Card noValidate>
          <Card.Item>
            <Card.Item.Label htmlFor="fullName">Full name</Card.Item.Label>
            <Input
              name='fullName'
              placeholder='Full name...'
              onChange={onChangeInput}
              value={fullName}
              required
            />
              {validatorProfile.message('fullName', fullName, 'required')}
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="territory">Territory</Card.Item.Label>
            <ReactSelect
                  value={selectedTerritory}
                  onChange={onChangeTerritory}
                  options={territories}
                  placeholder={'Select Territory ...'}
            />
              {validatorProfile.message('territory', selectedTerritory, 'required')}
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="phone">Phone</Card.Item.Label>
            <Input
              type="phone"
              name='phone'
              placeholder='Phone...'
              onChange={onChangeInput}
              value={phone}
              required
            />
              {validatorProfile.message('phone', phone, 'required')}
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="login">Login</Card.Item.Label>
            <Input
              name="login"
              value={login}
              onChange={onChangeInput}
              placeholder='Login...'
              required
            />
              {validatorProfile.message('login', login, 'required')}
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="email">Email</Card.Item.Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={onChangeInput}
              placeholder='Email...'
              required
            />
              {validatorProfile.message('email', email, 'required')}
          </Card.Item>
          <Card.Item>
            <Button onClick={onSave}>Save</Button>
          </Card.Item>
        </Card>
        <Card>
          <Card.Item>
            <Card.Item.Label htmlFor="oldPassword">Old Password</Card.Item.Label>
            <Input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={onChangeInput}
            />
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="newPassword">New Password</Card.Item.Label>
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={onChangeInput}
            />
          </Card.Item>
          <Card.Item>
            <Card.Item.Label htmlFor="confirmNewPassword">Confirm New Password</Card.Item.Label>
            <Input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={onChangeInput}
            />
              { isEmptyPasswordsFields && <Error>Please, enter fill in</Error> }
              { !isEqualNewPasswords && <Error>Please, passwords are not equal</Error> }
          </Card.Item>
          <Card.Item>
            <Button onClick={onChangePassword}>Change Password</Button>
          </Card.Item>
        </Card>
      </Card.List>
    );
};

Manager.defaultProps = {
    onSave: PropTypes.func,
    onChangeInput: PropTypes.func,
    onChangePassword: PropTypes.func,
    onChangeTerritory: PropTypes.func,
    data: PropTypes.shape({
        login: '',
        fullName: '',
        phone: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        territories: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            }),
        ),
        selectedTerritory: PropTypes.shape(
            {
                label: PropTypes.string,
                value: PropTypes.string,
            }
        ),
        isEmptyPasswordsFields: PropTypes.bool,
        isEqualNewPasswords: PropTypes.bool,
    }),
    validatorProfile: PropTypes.shape(),
};

Manager.propTypes = {
    onSave: PropTypes.func,
    onChangeInput: PropTypes.func,
    onChangePassword: PropTypes.func,
    onChangeTerritory: PropTypes.func,
    data: PropTypes.shape({
        login: PropTypes.string,
        fullName: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        oldPassword: PropTypes.string,
        newPassword: PropTypes.string,
        confirmNewPassword: PropTypes.string,
        territories: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            }),
        ),
        selectedTerritory: PropTypes.shape(
            {
                label: PropTypes.string,
                value: PropTypes.string,
            }
        ),
        isEmptyPasswordsFields: PropTypes.bool,
        isEqualNewPasswords: PropTypes.bool,
    }),
    validatorProfile: PropTypes.shape(),
};

export default Manager;
