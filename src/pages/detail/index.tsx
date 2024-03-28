import { useState, useEffect } from 'react' 
import styles from './detail.module.css'
import { useParams, useNavigate } from 'react-router-dom'

// https://coinlib.io/profile
// https://sujeitoprogramador.com/api-cripto/coin/?key=e126c792070cf521&symbol=

interface CoinProps {
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  low_24h: string;
  high_24h: string;
  total_volume_24h: string;
  delta_24h: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedLowprice: string;
  formatedHighprice: string;
  numberDelta: number;
  error?: string;
}

export function Detail() {
  const { cripto } = useParams()
  const [detail, setDetail] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    function getData() {
      fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=e126c792070cf521&symbol=${cripto}`)
      .then(response => response.json())
      .then((data: CoinProps) => {

        if(data.error) {
          navigate("/")
        }

        const price = Intl.NumberFormat("pt-BR", {
          style: 'currency',
          currency: 'BRL'
        })

        const resultData = {
          ...data,
          formatedPrice: price.format(Number(data.price)),
          formatedMarket: price.format(Number(data.market_cap)),
          formatedLowprice: price.format(Number(data.low_24h)),
          formatedHighprice: price.format(Number(data.high_24h)),
          numberDelta: parseFloat(data.delta_24h.replace(",", ".")),
        }

        setDetail(resultData)        
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        navigate('/');
      })
      .finally(() => {
        setLoading(false)
      })
    }

    getData();
  }, [cripto, navigate])

  if(loading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando informações...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detail?.name}</h1>
      <p className={styles.center}>{detail?.symbol}</p>

      <section className={styles.content}>
        <p><strong>Preço:</strong> {detail?.formatedPrice}</p>
        <p><strong>Maior preço 24hs:</strong> {detail?.formatedHighprice}</p>
        <p><strong>Menor preço 24hs:</strong> {detail?.formatedLowprice}</p>
        <p>
          <strong>Delta 24h</strong> 
          <span className={detail?.numberDelta && detail?.numberDelta >= 0 ? styles.tdProfit : styles.tdLoss}>
            {detail?.delta_24h}
          </span>
        </p>
        <p><strong>Valor mercado:</strong> {detail?.formatedMarket}</p>
    </section>
    </div>
  )
}