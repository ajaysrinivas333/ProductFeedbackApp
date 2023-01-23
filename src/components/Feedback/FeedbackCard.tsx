import { ButtonWithChild } from 'components/UI/Button';
import Card from 'components/UI/Card';
import UserRunDown from 'components/User/UserRunDown';
import React from 'react';
import { BsChevronUp } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import styles from '../../styles/feedback-card.module.scss';

const FeedbackCard = () => {
  return (
    <Card className={styles.feedbackCard}>
      <ButtonWithChild className={styles.upvoteButton}>
        <BsChevronUp className={styles.upIcon} />

        <span>{'80'}</span>
      </ButtonWithChild>
      <div className={styles.detailsWrapper}>
        <UserRunDown
          height={45}
          width={45}
          slug={'avatarId'}
          username={'displayName'}
          subText={'createdAt'}
          subTextStyles={{
            color: 'grey',
            fontWeight: 400,
          }}
        />
        <div className={styles.productDetails}>
          <p>Product 123</p>
          Give us a roadmap to something, idk, buying a razer Help us choose the
          right razer for us.
        </div>
      </div>
      <div className={styles.comments}>
        <FaComment className={styles.commentsIcon} />
      </div>
    </Card>
  );
};

export default FeedbackCard;
