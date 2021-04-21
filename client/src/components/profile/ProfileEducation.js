import React from 'react'
import PropTypes from 'prop-types'
import formatDate from '../../util/formatDate'

const ProfileEducation = ({ education: {school, fieldofstudy, degree, current, to, from, description}}) => 
    <div>
        <h3 className="text-dark">{school}</h3>
            <p>{formatDate(from)} - { to === null ? ('Current'): formatDate(to)}</p>
            <p><strong>Degree: </strong>{degree}</p>
            <p><strong>Field of study: </strong>{fieldofstudy}</p>
            <p>
              <strong>Description: </strong>{description}
            </p>
    </div>

ProfileEducation.propTypes = {
    education:PropTypes.object.isRequired,
}

export default ProfileEducation
