import React from 'react';
import Notification from '../../components/Notification/Notification';

const NotificationPage = () => {
  return (
    <div>
      <h2>Notifications</h2>
      <Notification message="You have no new notifications" type="info" />
    </div>
  );
};

export default NotificationPage;
