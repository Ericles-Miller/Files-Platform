import { receiveMessages } from '@Jobs/Consumer';

import { app } from './app';

app.listen(3333, () => console.log('Server is running!'));
// receiveMessages();

