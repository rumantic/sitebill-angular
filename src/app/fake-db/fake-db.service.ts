import { InMemoryDbService } from 'angular-in-memory-web-api';

import { MailFakeDb } from 'app/fake-db/mail';

export class FakeDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            // Mail
            'mail-mails'  : MailFakeDb.mails,
            'mail-folders': MailFakeDb.folders,
            'mail-filters': MailFakeDb.filters,
            'mail-labels' : MailFakeDb.labels
        };
    }
}
