import React, { Fragment } from 'react';
// import spinner from './spinner.gif';
import Spinner from 'react-spinner'

export default function () {
    return (
        <Fragment>
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>

        </Fragment>
    )
}