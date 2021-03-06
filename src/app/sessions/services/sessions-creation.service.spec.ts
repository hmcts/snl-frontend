import { SessionCreate } from '../models/session-create.model';
import { SessionsCreationService } from './sessions-creation.service';

let storeSpy;
let session: any | SessionCreate;

describe('SessionsCreationService', () => {
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    session = { userTransactionId: null };
  });

  describe('create', () => {
    beforeEach(() => {
        new SessionsCreationService(storeSpy).create(session);
    });
    it('should set userTransactionId for given session', () => {
      expect(session.userTransactionId).toBeDefined();
    });

    it('should dispatch two actions', () => {
      expect(storeSpy.dispatch).toHaveBeenCalledTimes(3);
    });

    it('should set transaction.id to be the same as session.userTransactionId', () => {
      const transactionId = storeSpy.dispatch.calls.first().args[0].payload.id;
      expect(transactionId).toEqual(session.userTransactionId);
    });
  });

  describe('amend', () => {
    beforeEach(() => {
        new SessionsCreationService(storeSpy).amend(session);
    });
    it('should set userTransactionId for given session', () => {
      expect(session.userTransactionId).toBeDefined();
    });

    it('should dispatch two actions', () => {
      expect(storeSpy.dispatch).toHaveBeenCalledTimes(3);
    });

    it('should set transaction.id to be the same as session.userTransactionId', () => {
      const transactionId = storeSpy.dispatch.calls.first().args[0].payload.id;
      expect(transactionId).toEqual(session.userTransactionId);
    });
  });
});
