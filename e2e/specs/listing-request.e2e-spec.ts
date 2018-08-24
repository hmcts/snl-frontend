import { NavigationFlow } from '../flows/navigation.flow'
import { LoginFlow } from '../flows/login.flow'
import { SessionSearchPage } from '../pages/session-search.po'
import { ListingCreationPage } from '../pages/listing-creation.po'
import { DeleteHearingPartDialogPage } from '../pages/delete-hearing-part-dialog.po'

require('../utils/driver-setup.ts')

import { listingCreationForm, caseNumber } from '../models/data/listing-creation-form-data';

const loginFlow = new LoginFlow()
const navigationFlow = new NavigationFlow()
const listingCreationPage = new ListingCreationPage()
const sessionSearchPage = new SessionSearchPage()
const deleteHearingPartDialogPage = new DeleteHearingPartDialogPage()

describe('Listing Request', () => {
  beforeAll(() => {
    loginFlow.loginIfNeeded()
    navigationFlow.goToNewListingRequestPage()
    listingCreationPage.createListingRequest(listingCreationForm)
  })

  describe('Delete listing request', () => {
    it('should remove listing request from list', async () => {
      navigationFlow.goToListHearingsPage()
      sessionSearchPage.clickDeleteListingRequestByCaseNumber(caseNumber)
      deleteHearingPartDialogPage.clickYesButton()

      expect(sessionSearchPage.isListingRequestPresent(caseNumber)).toEqual(false)

    })
  })
})