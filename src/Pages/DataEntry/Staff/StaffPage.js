import { useMutation } from '@apollo/client';
import { LinearProgress } from '@material-ui/core';
import { DELETE_USER } from 'api/mutations/deleteUser';
import { GET_USERS_FULL_DATA } from 'api/queries/getUsersFullInfo';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import React, { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import './staff.css';

const contextActions = (deleteHandler) => (
  <span onClick={deleteHandler} className='delete-action'>
    <span>Delete all</span>
    <span className='icons8-trash' style={{ cursor: 'pointer' }} />
  </span>
);

export default function StaffPage() {
  const [usersData, setUsersData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [deleteUser, { loading }] = useMutation(DELETE_USER);

  const handleChange = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const onDataFetched = ({ users }, fetchMore) => {
    try {
      setUsersData(users.filter((user) => user?.role?.name !== 'Super Admin'));
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleDeleteUser = useCallback(
    async (data, deleteAll) => {
      try {
        if (!deleteAll) {
          if (window.confirm(`Are you sure you want to delete this user?`)) {
            await deleteUser({
              variables: {
                id: data?.id,
              },
            });
            setUsersData((list) => list.filter((item) => item.id !== data.id));
          }
        } else {
          await deleteUser({
            variables: {
              id: data?.id,
            },
          });
          setUsersData((list) => list.filter((item) => item.id !== data.id));
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    [deleteUser]
  );

  const deleteAll = () => {
    if (!selectedRows.length) return;

    if (window.confirm(`Are you sure you want to delete these users?`)) {
      selectedRows.forEach(async (user) => {
        await handleDeleteUser(user, true);
      });
    }
  };

  useEffect(() => {
    const setInitialData = () => {
      setColumns([
        {
          name: '',
          selector: (row) => (
            <AvatarOrInitials
              url={row?.avatar?.url}
              name={row?.LecturerNameInArabic}
              className={'small-staff-table-avatar'}
            />
          ),
          sortable: false,
          grow: 0,
        },
        {
          name: 'Name',
          selector: 'LecturerNameInArabic',
          sortable: true,
        },

        {
          name: 'Username',
          selector: 'username',
          sortable: true,
          grow: 1,
        },
        {
          name: 'Email',
          selector: 'email',
          sortable: true,
          grow: 1,
        },
        {
          name: 'Department',
          selector: (row) => (
            <span>{row?.department?.DepartmentNameInEnglish || 'N/A'}</span>
          ),
          sortFunction: (rowA, rowB) =>
            rowA?.department?.DepartmentNameInEnglish?.charAt(0) >
            rowB?.department?.DepartmentNameInEnglish?.charAt(0),
          sortable: true,
        },

        {
          name: 'Role',
          selector: (row) => <span>{row?.role?.name || 'N/A'}</span>,
          sortFunction: (rowA, rowB) =>
            rowA?.role?.name?.charAt(0) > rowB?.role?.name?.charAt(0),
          sortable: true,
        },
        {
          cell: (row) => (
            <div
              className='icons8-trash'
              style={{ cursor: 'pointer' }}
              onClick={() => handleDeleteUser(row)}
            />
          ),
          allowOverflow: true,
          button: true,
          right: true,
        },
      ]);
    };
    setInitialData();
  }, [usersData, handleDeleteUser]);
  return (
    <main id='staff-main-page'>
      <header>
        <h4 className='font-weight600'>Staff & Users</h4>
      </header>
      <section className='staff-data-table-section'>
        {loading && <LinearProgress className='loading-bar' />}
        <div className={`${loading && 'disabled-form'}`} />
        <Query query={GET_USERS_FULL_DATA} onCompletedFunction={onDataFetched}>
          {() => {
            return (
              <>
                <div className='actions'>
                  <CSVLink
                    filename={'users.csv'}
                    data={usersData.map(
                      ({ LecturerNameInArabic, email, username, role }) => {
                        return {
                          Name: LecturerNameInArabic,
                          Email: email,
                          Username: username,
                          Role: role?.name,
                        };
                      }
                    )}
                    className='export-csv-btn'
                  >
                    <div className='icon-with-text-btn'>
                      <aside>
                        <div className='icons8-down'></div>
                      </aside>
                      <span>Export CSV</span>
                    </div>
                  </CSVLink>
                </div>

                <DataTable
                  columns={columns}
                  data={usersData}
                  defaultSortFieldId={1}
                  title='Staff & Users'
                  pagination
                  selectableRows
                  fixedHeader
                  progressPending={false}
                  striped
                  pointerOnHover
                  persistTableHead
                  highlightOnHover
                  selectableRowsVisibleOnly
                  selectableRowsHighlight
                  paginationTotalRows={usersData?.count}
                  contextActions={contextActions(deleteAll)}
                  onSelectedRowsChange={handleChange}
                  contextMessage={{
                    singular: 'User',
                    plural: 'Users',
                    message: 'selected',
                  }}
                />
              </>
            );
          }}
        </Query>
      </section>
    </main>
  );
}
