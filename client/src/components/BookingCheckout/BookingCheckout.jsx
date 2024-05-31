import React from 'react'

import { Modal, Button } from '@mantine/core';

const BookingCheckout = ({opened, close}) => {
  return (
    <div>
        <Modal opened={opened} onClose={close} withCloseButton={true} title="Your seat details!">
            This is chekout page
        </Modal>
    </div>
  )
}

export default BookingCheckout