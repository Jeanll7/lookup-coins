import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './home.module.css'
import { IoMdSearch } from "react-icons/io";

// https://sujeitoprogramador.com/api-cripto/?key=e126c792070cf521
// https://sujeitoprogramador.com/api-cripto/coin/?key=e126c792070cf521&symbol=BTC
//  API key: e126c792070cf521

interface CoinProps {
  name: string;
  price: string;
  symbol: string;
  delta_24h: string;
  volume_24h: string;
  market_cap: string;
  formatedPrice: string;
  formatedMarket: string;
}

interface DataProps {
  coins: CoinProps[];
}

export function Home() {
  const [coins, setCoins] = useState<CoinProps[]>([]);

  useEffect(() => {
    function getData() {
      fetch('https://sujeitoprogramador.com/api-cripto/?key=e126c792070cf521')
      .then(response => response.json())
      .then((data: DataProps) => {
        let coinsData = data.coins.slice(0, 10)

        let price = Intl.NumberFormat("pt-BR", {
          style: 'currency',
          currency: 'BRL'
        })

        const formatResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.price)),
            formatedMarket: price.format(Number(item.market_cap)),
          }
          return formated;
        })
        console.log(formatResult)
        setCoins(formatResult);
      })     
    }

    getData()
  }, [])  

  return (
    <main className={styles.container}>
      <form className={styles.form}>
        <input 
          type="text" 
          placeholder='Digite o simbolo da moeda: BTC...'
        />
        <button type='submit'>
          <IoMdSearch size={30} color='#fff' />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor de mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
          </tr>
        </thead>

        <tbody id='tbody'>
          {coins.map(coin => (
            <tr key={coin.name} className={styles.tr}>
              <td className={styles.tdLabel} data-label="Moeda">
                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                  <span>{coin.name}</span> | {coin.symbol}
                </Link>
              </td>
              <td className={styles.tdLabel} data-label="Mercado">
                {coin.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {coin.formatedPrice}
              </td>
              <td className={`${styles.tdVolume} ${Number(coin?.delta_24h) >= 0 ? styles.tdProfit : styles.tdLoss}`} 
              data-label="Volume">
                <span>{coin.delta_24h}</span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}