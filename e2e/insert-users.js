
const pgp = require('pg-promise')({
    // Initialization Options
});

const user_data = [
    {
        username: 'officer1',
        password: 'fa2fbd666a080874b7d83e611aa1a4e67f8c010fef1b19d7725725aa74f177a324b6c033e1abaf9e',
        full_name: 'Listing Officer 1',
        email: null,
        reset_required: false
    },
    {
        username: 'judge1',
        password: 'fa2fbd666a080874b7d83e611aa1a4e67f8c010fef1b19d7725725aa74f177a324b6c033e1abaf9e',
        full_name: 'John Harris',
        email: null,
        reset_required: false
    },
    {
        username: 'admin',
        password: 'fa2fbd666a080874b7d83e611aa1a4e67f8c010fef1b19d7725725aa74f177a324b6c033e1abaf9e',
        full_name: 'Administrator man',
        email: null,
        reset_required: false
    }
];

const user_data_cs = new pgp.helpers.ColumnSet([
    {name: 'username'},
    {name: 'password'},
    {name: 'password_last_updated', mod: '^', def: 'CURRENT_TIMESTAMP'},
    {name: 'full_name'},
    {name: 'email'},
    {name: 'reset_required'}
]);

const user_roles = [
    {
        user_id: '(SELECT id from user_data where username=\'officer1\')',
        role: 'ROLE_USER'
    },
    {
        user_id: '(SELECT id from user_data where username=\'officer1\')',
        role: 'ROLE_OFFICER'
    },
    {
        user_id: '(SELECT id from user_data where username=\'judge1\')',
        role: 'ROLE_USER'
    },
    {
        user_id: '(SELECT id from user_data where username=\'judge1\')',
        role: 'ROLE_JUDGE'
    },
    {
        user_id: '(SELECT id from user_data where username=\'admin\')',
        role: 'ROLE_USER'
    },
    {
        user_id: '(SELECT id from user_data where username=\'admin\')',
        role: 'ROLE_ADMIN'
    }
];

const user_roles_cs = new pgp.helpers.ColumnSet([
    {name: 'user_id', mod: '^'},
    {name: 'role'}
]);

exports.insertUserData = async function(apiDbHost, apiDbPort, apiDbName, apiDbUser, apiDbPassword) {
    // Preparing the connection details:
    //const cn = 'postgres://snluser:snlpass@localhost:5432/snl';
    const cn = {
        host: apiDbHost,
        port: apiDbPort,
        database: apiDbName,
        user: apiDbUser,
        password: apiDbPassword
    };

    // Creating a new database instance from the connection details:
    const db = pgp(cn);

    await db.none(pgp.helpers.insert(user_data, user_data_cs, 'user_data') + ' ON CONFLICT DO NOTHING')
        .catch(err => {
            console.log(err.message || err);
            throw err;
        });
    await db.none(pgp.helpers.insert(user_roles, user_roles_cs, 'user_roles') + ' ON CONFLICT DO NOTHING')
        .catch(err => {
            console.log(err.message || err);
            throw err;
        });
}
