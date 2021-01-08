import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import '../assets/LazyLoadMore.css';

const RecursivePagination = props => {
    const [nextPageData, setNextPageData] = useState({});
    const [isLoadingNext, setLoaderState] = useState(false);
    let entityArr = props.paginationEntityIds.slice();
    let nextEntityId = 0;
    if(entityArr.length){
        nextEntityId = entityArr.shift();
    }
    const isEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    useEffect(()=>{
        if(props.isAutoLoad){
            createAutoLoadObserver();
            attachAutoLoadObserver('#lazy_load_next_'+props.uniqueId+'_'+nextEntityId);
        }
        return ()=>{
            if(props.isAutoLoad) {
                destroyAutoLoadObserver();
            }
        }
    }, []);
    const createAutoLoadObserver = () => {
        if(typeof window == 'undefined'){
            return false;
        }
        let options = {
            root: null,
            rootMargin : "0px 0px "+props.bottomOffset+" 0px",
            threshold: [0.1]
        };
        if(typeof window['loadMoreObserver_'+props.uniqueId] == 'undefined'){
            if (!('IntersectionObserver' in window)) {
                return false;
            }else {
                window['loadMoreObserver_'+props.uniqueId] = new IntersectionObserver(loadMoreIntersectionCallback, options);
                return true;
            }
        }
    };
    const loadMoreIntersectionCallback = (entries) => {
        let entry = entries[0];
        let id = entry.target.getAttribute('id');
        if (entry.intersectionRatio >= 0.1) {
            const el=document.getElementById(id)
            window['loadMoreObserver_'+props.uniqueId].unobserve(el);
            (el.childNodes && el.childNodes.length>0) ? el.childNodes[0].click() : null;
        }
    };
    const destroyAutoLoadObserver = () => {
        if(typeof window == 'undefined' || typeof window['loadMoreObserver_'+props.uniqueId] == 'undefined'){
            return;
        }
        window['loadMoreObserver_'+props.uniqueId].disconnect();
    };
    const attachAutoLoadObserver = (selector) => {
        if(selector === '' || !document.querySelector(selector) || typeof window == 'undefined' || typeof window['loadMoreObserver_'+props.uniqueId] == 'undefined'){
            return false;
        }
        window['loadMoreObserver_'+props.uniqueId].observe(document.querySelector(selector));
        return true;
    };
    const getNextPageData = (entityId) => {
        if(props.getNextPageData){
            props.getNextPageData(entityId).then(newData => {
                setLoaderState(false);
                if(newData && newData.lazyComponentsNewProps){
                    setNextPageData(newData);
                }else{
                    setNextPageData({});
                }
                if(newData && newData.callbackData){
                    nextBtnPostCallback(newData.callbackData);
                }
            });
        }
    };
    const nextBtnPreCallback = (nextId) => {
        if(isLoadingNext){
            return;
        }
        setLoaderState(true);
        if(props.preCallback){
            if(props.preCallback()){
                getNextPageData(nextId);
            }
        }else{
            getNextPageData(nextId);
        }
    };
    const nextBtnPostCallback = (callbackData) => {
        if(props.postCallback){
            props.postCallback(callbackData);
        }
    };

    return <React.Fragment>
        {props.LazyComponent}
        {!isEmpty(nextPageData['lazyComponentsNewProps']) && <RecursivePagination 
            {...props}
            paginationEntityIds={entityArr}
            LazyComponent={
                !isEmpty(nextPageData['lazyComponentsNewProps']) && React.cloneElement(props.LazyComponent, {
                    ...nextPageData['lazyComponentsNewProps'],
                    isFirstPage : false
                })
            }
        />}
        {nextEntityId && isEmpty(nextPageData['lazyComponentsNewProps']) && entityArr.length >= 0 ? <div id={`lazy_load_next_${props.uniqueId+'_'+nextEntityId}`} className="load-more-container"><button className={'inf-pgntn button button--secondary arrow'+(isLoadingNext ? ' loading' : '')} onClick={()=>{nextBtnPreCallback(nextEntityId)}}>{isLoadingNext ? 'Loading...' : props.nextButtonLabel}</button></div> : null}
    </React.Fragment>
};
RecursivePagination.defaultProps = {
    nextButtonLabel : 'Load More',
    paginationEntityIds : [],
    getNextPageData : null,
    preCallback : null,
    postCallback : null,
    isAutoLoad : false,
    bottomOffset : '100px',
    uniqueId : Date.now()
};
RecursivePagination.propTypes = {
    nextButtonLabel : PropTypes.string,
    paginationEntityIds : PropTypes.array.isRequired,
    getNextPageData : PropTypes.func.isRequired,
    preCallback : PropTypes.func,
    postCallback : PropTypes.func,
    isAutoLoad : PropTypes.bool,
    bottomOffset : PropTypes.string,
    uniqueId : PropTypes.string.isRequired,
    LazyComponent : PropTypes.element.isRequired
};

export default RecursivePagination;