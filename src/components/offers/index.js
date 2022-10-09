/*
  This React components downloads the active Offers from the REST API and
  displays them in a data table.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import axios from 'axios'
import { DatatableWrapper, TableBody, TableHeader } from 'react-bs-datatable'

// Local libraries
import config from '../../config'
import WaitingModal from '../waiting-modal'
import VerifiedTokens from './verified'

// Global variables and constants
const SERVER = `${config.server}/`
// let _this

const TABLE_HEADERS = [
  {
    prop: 'ticker',
    title: 'Ticker',
    isFilterable: true
  },
  {
    prop: 'tokenId',
    title: 'Token ID'
  },
  {
    prop: 'buyOrSell',
    title: 'Type'
  },
  {
    prop: 'p2wdbHash',
    title: 'P2WDB ID'
  },
  {
    prop: 'numTokens',
    title: 'Quantity'
  },
  {
    prop: 'usdPrice',
    title: 'Price (USD)'
  },
  {
    prop: 'button',
    title: 'Action'
  }
]

class Offers extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      balance: '',
      textInput: '',
      // wallet: props.wallet,
      appData: props.appData,
      offers: [],

      // Modal state
      showModal: false,
      modalBody: [],
      hideSpinner: false,
      denyClose: false
    }

    // Bind 'this' object to functions below.
    this.handleBuy = this.handleBuy.bind(this)
    this.onModalClose = this.onModalClose.bind(this)

    // Encapsulate dependencies
    this.verify = new VerifiedTokens()

    // _this = this
  }

  render () {
    // console.log(`Rendering with this offer data: ${JSON.stringify(this.state.offers, null, 2)}`)

    const heading = 'Generating Counter Offer...'

    return (
      <>
        {
          this.state.showModal
            ? <WaitingModal
                heading={heading}
                body={this.state.modalBody}
                hideSpinner={this.state.hideSpinner}
                denyClose={this.state.denyClose}
                closeFunc={this.onModalClose}
              />
            : null
        }
        <Container>
          <Row>
            <Col className='text-break' style={{ textAlign: 'center' }}>
              <DatatableWrapper body={this.state.offers} headers={TABLE_HEADERS}>
                <Table>
                  <TableHeader />
                  <TableBody />
                </Table>
              </DatatableWrapper>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

  // Executes when the component mounts.
  async componentDidMount () {
    // Retrieve initial offer data
    this.handleOffers()

    // Get data and update the table periodically.
    setInterval(() => {
      this.handleOffers()
    }, 30000)
  }

  // Get Offer data and manipulate it for the sake of presentation.
  async handleOffers () {
    // Get raw offer data.
    const offerRawData = await this.getOffers()
    // console.log(`offers: ${JSON.stringify(offers, null, 2)}`)

    // Formatted Data
    const offers = []

    for (let i = 0; i < offerRawData.length; i++) {
      const thisOffer = offerRawData[i]
      // console.log(`thisOffer: ${JSON.stringify(thisOffer, null, 2)}`)

      // Skip scam tokens that try to impersonate verified tokens.
      const isScam = this.verify.checkTicker(thisOffer.ticker, thisOffer.tokenId)
      if (isScam) continue

      // Get and format the token ID
      const tokenId = thisOffer.tokenId
      const smallTokenId = this.cutString(tokenId)
      thisOffer.tokenId = (<a href={`https://token.fullstack.cash/?tokenid=${tokenId}`} target='_blank' rel='noreferrer'>{smallTokenId}</a>)

      // Get and format the P2WDB ID
      const p2wdbHash = thisOffer.p2wdbHash
      const smallP2wdbHash = this.cutString(p2wdbHash)

      thisOffer.button = (<Button text='Buy' variant='success' size='lg' id={p2wdbHash} onClick={this.handleBuy}>Buy</Button>)

      thisOffer.p2wdbHash = (<a href={`https://p2wdb.fullstack.cash/entry/hash/${p2wdbHash}`} target='_blank' rel='noreferrer'>{smallP2wdbHash}</a>)

      // console.log('this.state.appData: ', this.state.appData)

      // Convert sats to BCH, and then calculate cost in USD.
      const bchjs = this.state.appData.bchWallet.bchjs
      const rateInSats = parseInt(thisOffer.rateInBaseUnit)
      // console.log('rateInSats: ', rateInSats)
      const bchCost = bchjs.BitcoinCash.toBitcoinCash(rateInSats)
      // console.log('bchCost: ', bchCost)
      // console.log('bchUsdPrice: ', this.state.appData.bchWalletState.bchUsdPrice)
      const usdPrice = bchCost * this.state.appData.bchWalletState.bchUsdPrice
      // console.log('usdPrice: ', usdPrice)
      const priceStr = `$${usdPrice.toFixed(3)}`
      thisOffer.usdPrice = priceStr

      // console.log(`thisOffer: ${JSON.stringify(thisOffer, null, 2)}`)

      offers.push(thisOffer)
    }

    this.setState({
      offers
    })
    // console.log('offers: ', offers)
  }

  async handleBuy (event) {
    try {
      console.log('Buy button clicked. Event: ', event)

      const targetOffer = event.target.id
      console.log('targetOffer: ', targetOffer)

      // Initialize modal
      this.setState({
        showModal: true,
        modalBody: ['Generating Counter Offer...', '(This can take a couple minutes)'],
        hideSpinner: false,
        denyClose: true
      })

      // Generate a Counter Offer.
      const bchDexLib = this.state.appData.dex
      const p2wdbOut = await bchDexLib.take.takeOffer(targetOffer)
      console.log('p2wdbOut: ', p2wdbOut)

      // Handle different output types.
      let p2wdbHash = p2wdbOut.hash
      if (p2wdbHash.hash) p2wdbHash = p2wdbHash.hash

      // Add link to output
      const modalBody = []
      modalBody.push('Success!')
      modalBody.push(<a href={`https://p2wdb.fullstack.cash/entry/hash/${p2wdbHash}`} target='_blank' rel='noreferrer'>P2WDB Entry</a>)
      modalBody.push('What happens next:')
      modalBody.push('The money has not yet left your wallet! It is still under your control.')
      modalBody.push('If the sellers node is online, they will accept the Counter Offer you just generated in a few minutes.')
      modalBody.push('If the tokens never show up, you can sweep the funds back into your wallet.')

      this.setState({
        modalBody,
        hideSpinner: true,
        denyClose: false
      })
    } catch (err) {
      this.setState({
        showModal: true,
        modalBody: ['Error trying to generate Counter Offer!', err.message],
        hideSpinner: true,
        denyClose: false
      })
    }
  }

  // REST request to get data from avax-dex
  async getOffers () {
    try {
      const options = {
        method: 'GET',
        url: `${SERVER}offer/list/fungible/0`,
        data: {}
      }
      const result = await axios.request(options)
      // console.log('result.data: ', result.data)

      return result.data
    } catch (err) {
      console.warn('Error in getOffers() ', err)
    }
  }

  // Given a large string, it will return a string with the first and last
  // four characters.
  cutString (str) {
    try {
      const subTxid = str.slice(0, 4)
      const subTxid2 = str.slice(-4)
      return `${subTxid}...${subTxid2}`
    } catch (err) {
      console.warn('Error in cutString() ', err)
    }
  }

  onModalClose () {
    this.setState({ showModal: false })
  }
}

export default Offers
