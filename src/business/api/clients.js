import { Client } from '../../models';

/**
 * @param body
 * @param managerId
 * @returns {data}
 */
const makeCreatingOfClient = (body, managerId) => {
    const {
        name,
        passportData: passport_data,
        phone,
        email,
        territory,
    } = body;

    const data = {
        name,
        passport_data,
        phone,
        email,
        territory,
        manager_id: managerId,
    };

    return Client.create(data);
};

/**
 * @param userId
 * @param clientId
 * @param body
 * @param role
 */
const makeUpdatingOfClient = (userId, clientId, body, role) => {
    const {
        name,
        passportData: passport_data,
        phone,
        email,
        territory,
    } = body;

    const data = {
        name,
        passport_data,
        phone,
        email,
        territory,
    };

    if (role === 'manager') {
        data.manager_id = userId;
    } else {
        data.admin_id = userId;
    }

    const query = {
        where: {
            id: clientId,
        },
    };

    return Client.update(data, query);
};

/**
 * @param id {Number}
 * @param managerId {Number}
 */
const makeMarkingDeletionOfClient = (id, managerId) => {
    const query = {
        where: {
            id,
        },
    };

    const data = {
        is_removed: true,
        manager_id: managerId,
    };

    return Client.update(data, query);
};


/**
 * @param clientId {Number}
 */
const makeRemovingOfClient = clientId => {
    const query = {
        where: {
            id: clientId,
        },
    };

    return Client.destroy(query);
};

/**
 * @param clientId {Number}
 * @param managerId {Number}
 * @param role {String}
 * @return {Promise.<Model>}
 */
const findClient = (clientId, managerId, role) => {
    const query = {
        where: {
            id: clientId,
        },
        attributes: [
            'id',
            'email',
            'is_removed',
            'name',
            'passport_data',
            'phone',
            'territory',
        ],
    };

    if (role === 'manager') {
        query.where.manager_id = managerId;
    }

    return Client.findOne(query)
        .then(client => {
            const result = {
                id: client.id,
                email: client.email,
                isRemoved: client.is_removed,
                name: client.name,
                passportData: client.passport_data,
                phone: client.phone,
            };

            if (role !== 'manager') {
                result.territory = client.territory;
            }

            return result;
        });
};

/**
 * @param managerId {Number | null}
 * @return {Promise<Model<any, any>[]>}
 */
const findAllClients = (managerId = null) => {
  const query = {
      attributes: [
          'id',
          'email',
          'name',
      ],
      where: {},
  };

  if (managerId) {
      query.where.manager_id = managerId;
  }

  return Client.findAll(query);
};

export {
    makeCreatingOfClient,
    makeUpdatingOfClient,
    makeMarkingDeletionOfClient,
    makeRemovingOfClient,
    findClient,
    findAllClients,
};
