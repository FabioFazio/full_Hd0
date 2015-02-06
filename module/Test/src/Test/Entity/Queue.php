<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity */
class Queue {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="integer", unique=true) */
	protected $order;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $name;
	
	/** @ORM\Column(type="string", length=255) */
	protected $code;
	
	/** @ORM\ManyToOne(targetEntity="Service") */
	protected $service;

	public function getId(){
	    return $this->id;
	}
	
	public function setId($id){
		$this->id = $id;
	}
    
    public function setOrder($order){
    	$this->order = $order;
    }

    public function getOrder(){
    	return $this->order;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }

    public function getService(){
    	return $this->service;
    }
    
    public function setService($service){
    	$this->service = $service;
    }
    
    public function toArray()
    {
        $array = get_object_vars($this);
        $array['service_id'] = $this->getService()->getId();
        unset($array['service']);
    	return $array;
    }
}